#Saber-storage  [![Build Status](https://travis-ci.org/ecomfe/saber-storage.svg?branch=develop)](https://travis-ci.org/ecomfe/saber-storage)
=====
   
移动端本地存储模块
  
##Usage
    
```javascript

	var Storage = require( 'saber-storage' );
	var storage = new Storage();
	//存入
	storage.setItem( 'string', 'this is a string' );
	storage.setItem( 'object', { a: 1 } );
	var isSuccess = storage.setItem( 'array', [1, 2, 3, 4] );
	
	if (isSuccess) {
	    // Save success!
	    
	} else {
	    // Save fail!
	
	}
	
	//取出
	var value = storage.getItem( 'string' );
	
	//移除某一键值下的数据
	storage.removeItem( 'string' );
	
	//清空全部数据
	storage.clear();
	
	//事件派发
	storage.on( Storage.Event.OUT_OF_LIMIT, function( error ) {
	    //空间存满
	    
	} );
	
```
   
##API
  
###Interface overview

    interface Storage {
        attribute string Event.OUT_OF_LIMIT;
        
        attribute Function 
    }
###Events
Storage.Event.OUT_OF_LIMIT


###Methods
.isSupport():Boolean 

.setItem( key:String, val:* ):Boolean

.getItem( key:String ):*

.removeItem( key:String ):void

.clear():void

.key():Array

.on(eventName:String, callback:Function):void

  

