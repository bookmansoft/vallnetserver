/*!
 * lock.js - lock and queue for gamegold
 * Copyright (c) 2018-2020, Bookman Software (MIT License).
 */

'use strict';

const assert = require('assert');

/**
 * 互斥锁
 * Represents a mutex lock for locking asynchronous object methods.
 * 
 * @note Lock 对象中的任务名称，只是作为一个备注字段，和 MappedLock 对象中支持并发的命名任务完全不同
 * 
 * @alias module:utils.Lock
 */

class Lock
{
  /**
   * @constructor
   * @param {Boolean?} noted - Whether to maintain a map of queued jobs indexed by job note.
   */
  constructor(noted) {
    this.noted = noted === true;            // 表示当前锁对象是否支持任务备注字段, true 支持 false 不支持
    this.destroyed = false;                 // 锁已销毁标志

    this.map = new Map();                   // 所有命名任务的名称索引
    this.jobs = [];                         // 存储所有任务对象的数组，这些任务有可能是命名任务，也可能不是
    this.busy = false;                      // true 存在正在执行的当前任务
    this.current = null;                    // 当前任务的名称（备注字段）
    this.unlocker = this.unlock.bind(this); // 解锁函数
  }

  /**
   * 检测是否有同名的命名任务正在执行，或者位于任务队列中
   * Test whether the lock has a pending job or a job in progress (by name).
   * @param {String} name
   * @returns {Boolean}
   */

  has(name) {
    assert(this.noted, 'Must use named jobs.');

    if (this.current === name) {
      return true;
    }

    const count = this.map.get(name);
    if (count == null) {
      return false;
    }

    return count > 0;
  };

  /**
   * 检测是否有同名的命名任务位于任务队列中
   * Test whether the lock has a pending job by name.
   * @param {String} name
   * @returns {Boolean}
   */

  hasPending(name) {
    assert(this.noted, 'Must use named jobs.');

    const count = this.map.get(name);

    if (count == null) {
      return false;
    }

    return count > 0;
  };

  /**
   * Lock the parent object and all its methods which use the lock. 
   * Begin to queue calls.
   * 
   * @warning 连续以 await 语法调用同一个锁对象的 lock 方法会造成死锁，无论是否传递名称参数 - 除非传递了force参数
   * 
   * @param {String?} name - Job name. 如果是非命名锁，该参数表示是否强制执行
   * @param {Boolean?} force - Bypass the lock. 如果是非命名锁，该参数无意义
   * @returns {Promise} - Returns {Function}, must be called 
   * once the method finishes executing in order to resolve the queue.
   */

  lock(arg1, arg2) {
    let note, force;

    if (this.noted) {
      note = arg1 || null;
      force = arg2;
    } else {
      note = null;
      force = arg1;
    }

    if (this.destroyed) {
      return Promise.reject(new Error('Lock is destroyed.'));
    }

    if (force) { //宣布当前任务获取了锁，并分配一个空的解锁函数
      return Promise.resolve(nop);
    }

    if (this.busy) { //如果锁已经被占用
      if (note) { //命名任务：累计同名任务数量
        let count = this.map.get(note);
        if (!count) {
          count = 0;
        }
        this.map.set(note, count + 1);
      }

      //返回Promise，将resolve函数打包成任务并加入队列，并在排队到期时获得锁控制权
      return new Promise((resolve, reject) => {
        this.jobs.push(new Job(resolve, reject, note));
      });
    }
    else { //锁处于空闲状态
      this.busy = true; //设置属性：当前锁已经被占用
      this.current = note; //设置属性：当前正在执行的任务备注
  
      //宣布当前任务获取了锁，分配常规解锁函数
      return Promise.resolve(this.unlocker);
    }
  };

  /**
   * The actual unlock callback.
   * @private
   */

  unlock() {
    if(this.destroyed || !this.busy) {
      return;
    }

    this.busy = false; // 设为非执行状态
    this.current = null; // 清空当前任务

    if (this.jobs.length === 0) { //如果所有任务都已经完成，直接返回
      return;
    }
    
    //队列中还有未执行的任务
    const job = this.jobs.shift(); // 弹出新的任务
    if (job.name) { // 如果是命名任务
      let count = this.map.get(job.name); // 查询该任务剩余堆叠次数
      assert(count > 0);
      if (--count === 0)
        this.map.delete(job.name); // 任务堆叠次数降为零，清除
      else
        this.map.set(job.name, count); // 更新堆叠次数
    }

    this.busy = true; // 设为执行状态
    this.current = job.name; // 设置当前任务

    //执行任务的resolve函数结束相关Promise，换句话说就是为其分配锁的控制权，同时送出解锁函数
    job.resolve(this.unlocker);
  };

  /**
   * Destroy the lock. Purge all pending calls.
   */

  destroy() {
    if(!this.destroyed) {
      this.destroyed = true;

      this.busy = false;
      this.current = null;

      const jobs = this.jobs;
      this.jobs = [];
      this.map.clear();
  
      for (const job of jobs) {
        job.reject(new Error('Lock was destroyed.'));
      }
    }
  };  
}

/**
 * Lock Job
 * @constructor
 * @ignore
 * @param {Function} resolve
 * @param {Function} reject
 * @param {String?} name
 */

function Job(resolve, reject, name) {
  this.resolve = resolve;
  this.reject = reject;
  this.name = name || null;
}

/*
 * Helpers
 */

function nop() {}

/*
 * Expose
 */

module.exports = Lock;
