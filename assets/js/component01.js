
(function($) {
    
    
        $('a[data-reveal-id]').live('click', function(e) {   //live
            e.preventDefault();   //e.preventDefault()
            var modalLocation = $(this).attr('data-reveal-id'); //attr
            $('#'+modalLocation).reveal($(this).data());  //请注意data()的用法
        });
    
    
    
        $.fn.reveal = function(options) {
        
            var defaults = {  
                animation: 'fadeAndPop', 
                animationspeed: 300, 
                closeonbackgroundclick: true, 
                dismissmodalclass: 'close-reveal-modal'
            }; 
            
            var options = $.extend({}, defaults, options);  //extend合并多个对象
            console.log('option',options);
            console.log('this',this);
    
            return this.each(function() {
            
                var modal = $(this),
                    topMeasure  = parseInt(modal.css('top')),
                    topOffset = modal.height() + topMeasure,
                      locked = false,
                    modalBG = $('.reveal-modal-bg');
    
                if(modalBG.length == 0) {
                    modalBG = $('<div class="reveal-modal-bg">').insertAfter(modal);
                }		    
    
                modal.bind('reveal:open', function () {
                  modalBG.unbind('click.modalEvent');
                    $('.' + options.dismissmodalclass).unbind('click.modalEvent');
                    if(!locked) {
                        lockModal();
                        if(options.animation == "fadeAndPop") {
                            modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible'});
                            modalBG.fadeIn(options.animationspeed/2);
                            modal.delay(options.animationspeed/2).animate({
                                "top": $(document).scrollTop()+topMeasure + 'px',
                                "opacity" : 1
                            }, options.animationspeed,unlockModal());					
                        }
                        if(options.animation == "fade") {
                            modal.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+topMeasure});
                            modalBG.fadeIn(options.animationspeed/2);
                            modal.delay(options.animationspeed/2).animate({
                                "opacity" : 1
                            }, options.animationspeed,unlockModal());					
                        } 
                        if(options.animation == "none") {
                            modal.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
                            modalBG.css({"display":"block"});	
                            unlockModal()				
                        }
                    }
                    modal.unbind('reveal:open');
                }); 	
    
                //Closing Animation
                modal.bind('reveal:close', function () {
                  if(!locked) {
                        lockModal();
                        if(options.animation == "fadeAndPop") {
                            modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                            modal.animate({
                                "top":  $(document).scrollTop()-topOffset + 'px',
                                "opacity" : 0
                            }, options.animationspeed/2, function() {
                                modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
                                unlockModal();
                            });					
                        }  	
                        if(options.animation == "fade") {
                            modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                            modal.animate({
                                "opacity" : 0
                            }, options.animationspeed, function() {
                                modal.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
                                unlockModal();
                            });					
                        }  	
                        if(options.animation == "none") {
                            modal.css({'visibility' : 'hidden', 'top' : topMeasure});
                            modalBG.css({'display' : 'none'});	
                        }		
                    }
                    modal.unbind('reveal:close');
                });     
           
                modal.trigger('reveal:open')
                
                //Close Modal Listeners
                var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
                  modal.trigger('reveal:close')
                });
                
                if(options.closeonbackgroundclick) {
                    modalBG.css({"cursor":"pointer"})
                    modalBG.bind('click.modalEvent', function () {
                      modal.trigger('reveal:close')
                    });
                }
                $('body').keyup(function(e) {
                    if(e.which===27){ modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
                });
                
                
                function unlockModal() { 
                    locked = false;
                }
                function lockModal() {
                    locked = true;
                }	
                
            });//each call
        }//orbit plugin call
    })(jQuery);
            
    
    
    
    // 理一下思路：
    // 1.分为三个效果 掉下来 fade  没有效果  实现效果主要用的是 animated(styles,speed,easing,callback)
    
    // 大量使用的是：
    // 首先利用 $obj.bind('fucName',fuc) 方法给对象绑定event的方法 
    // 再通过 $obj.triger('fucName') 函数调用funName方法
    
    // html5里面有一个自定义属性 data-
    // 本文利用这个属性 
    // 1.自定义属性id相同 各自的animation效果设置不同
    // 然后通过 data() 方法获取到 属性和值形成的 json
    // 然后利用 extend({},json1,json2) 自定义属性集合 比如时间合并json形成新的对象 newJson
    // newJson.each()方法进行</div>