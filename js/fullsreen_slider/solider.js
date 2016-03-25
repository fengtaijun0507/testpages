(function($) {
    "use strict";
    var PageSlider = function(options) {
        //初始化参数对象
        this.params = $.extend({}, $.fn.pageSlider.defaults, options || {});
        //初始化dom相关参数
        this.container = $(this.params.domStructure.container);

        this.sections = $(this.params.domStructure.sections);

        this.section = $(this.params.domStructure.section);

        this.pages = $(this.params.domStructure.pages);

        this.item = $(this.params.domStructure.item);

        this.active = $(this.params.domStructure.active);
        //初始化滑动方向
        this.direction = this.params.direction;
        //初始化动画过度参数
        this.timingFunction = this.params.timingFunction;

        this.duration = this.params.duration;
        //初始化是否支持循环的标志参数
        this.loop = this.params.loop;
        //初始化是否分页的标志参数
        this.pagination = this.params.pagination;
        //初始化是否支持键盘事件的标志参数
        this.keyboard = this.params.keyboard;

        this.callback = this.params.callback;
        this.index = 0;
        this.counter=0;
        this.init();

    };
    PageSlider.prototype = {
        constructor: PageSlider,
        //主要是参数与属性的初始化
        init: function() {
            var self = this;
            self.initLayout();
            self.initEvent();
        },
        initLayout: function() {
            var self = this;
            //主页面布局初始化
            if (self.direction == 'horizontal') {
                var num = self.section.length,
                    sectionswidth = self.section.length * 100 + '%',
                    sectionwidth = (100 / num).toFixed(2) + '%';
                self.container.width(sectionswidth);
                // self.sections.width(sectionswidth);
                self.section.width(sectionwidth).addClass('left');

            }
            //分页初始化
            if (self.direction == 'horizontal') {
                if (self.pagination) {
                    self.pages.addClass('horizontal');
                    self.item.css({
                        'float': 'left',
                        'margin-left': '10px'
                    });

                } else {
                    self.pages.css({
                        'display': 'none'
                    });

                }
            } else {
                if (self.pagination) {
                    self.pages.addClass('vertical');
                    self.item.css({
                        'float': 'none',
                        'margin-bottom': '10px'
                    });

                } else {
                    self.pages.css({
                        "display": 'none'
                    });
                }
            }
        },
        initEvent: function() {
            /*注册鼠标滑轮事件*/
            var self = this;

            $(document).on('mousewheel DOMMouseScroll', function(event) {
                event.preventDefault();
                /* Act on the event */
                self.counter++;
                if(self.counter==3){
                event = event || window.event;
                var value = event.originalEvent.wheelDelta || -event.originalEvent.detail;
                var delta = Math.max(-1, Math.min(1, value));
                console.log(delta);
                self._scrollNext(self.index, delta);
                self._pageCssChange(self.index);
                self.counter=0;
                console.log(self.counter);
                }
            });
            /*注册键盘事件*/
            $(document).on('keydown', function(event) {
                event.preventDefault();
                /* Act on the event */

                var delta = 0;
                if (self.keyboard) {
                    if (event.keyCode == 39 || event.keyCode == 40) {
                        delta = -1;
                    }

                    if (event.keyCode == 37 || event.keyCode == 38) {
                        delta = 1;
                    }

                    self._scrollNext(self.index, delta);
                    self._pageCssChange(self.index);
                }
            });
            /*增加鼠标点击事件*/
            self.item.on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                var clickIndex = $(this).index();
                self._scrollNext(self.index, 0, clickIndex);
                self._pageCssChange(self.index);
            });
            /*注册动画结束出发事件*/
            self.sections.on('transitionend webkitTransitionEnd msTransitonEnd mozTransitionEnd', '.selector', function(event) {
                event.preventDefault();
                /* Act on the event */
                if (self.callback && typeof(self.callback) == 'function')
                    self.callback;
            });

        },
        //鼠标轮滑事件的核心执行函数
        _scrollNext: function(curIndex, delta, clickIndex) {
            //获取轮播页面的数目
            self = this;
            var lenth = self.section.length,
                place = null,
                nextIndex = self._getNextIndex(curIndex, delta, clickIndex);
            var place = self.section.eq(nextIndex).position();
            self._excAnimation(place);
        },
        //获取下一张图片的索引值
        _getNextIndex: function(curIndex, delta, clickIndex) {
            self = this;

            var nextIndex = curIndex,
                lenth = self.section.length;
            if (clickIndex || clickIndex === 0) {

                nextIndex = clickIndex;
            } else if (delta > 0) {
                if (curIndex) {
                    nextIndex = curIndex - 1;
                } else {
                    nextIndex = lenth - 1;
                };
            } else if (delta < 0) {
                if (curIndex < lenth - 1) {
                    nextIndex = curIndex + 1;
                } else {
                    nextIndex = 0;
                }

            };
            self.index = nextIndex;
            return nextIndex;
        },
        //判断是否支持某个CSS
        _isSurportCSS: function(property) {
            var body = $("body")[0];
            var finalCss = null;
            for (var i = 0, len = property.length; i < len; i++) {
                if (property[i] in body.style) {
                    finalCss = property[i];
                }
            }
            return finalCss;
        },
        //定义适配浏览器的css3属性
        _combineCSS: function(property) {
            var preArray = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
            var proArray = [];
            for (var item in preArray) {
                var temp = preArray[item] + property;
                proArray.push(temp);

            }
            return proArray;
        },
        //切换图片的动画实现代码
        _excAnimation: function(position) {
            var self = this;
            var trformArray = self._combineCSS("transform");
            var tstionArray = self._combineCSS("transition");
            if (self._isSurportCSS(trformArray) && self._isSurportCSS(tstionArray)) {
                var tr = self._isSurportCSS(trformArray);
                var ts = self._isSurportCSS(tstionArray);
                if (self.direction == "horizontal") {
                    var trStirng = 'translateX(-' + position.left + 'px)',
                        tsString = 'all ' + self.timingFunction + ' ' + self.duration + 'ms';
                    self.container.css({
                        "transform": trStirng,
                        "transition": tsString,
                        "-webkit-transform": trStirng,
                        "-webkit-transition": tsString,
                        "-ms-transform": trStirng,
                        "-ms-transition": tsString,
                        "-moz-transform": trStirng,
                        "-moz-transition": tsString,
                        "-o-transform": trStirng,
                        "-o-transition": tsString
                    });
                    /*   self.container.css({
                           "-webkit-transform":"translateX(-800px)"
                       });*/

                } else {
                    self.container.css({
                        tr: 'translate(-' + position.top + ',0)',
                        ts: 'all ' + self.timingFunction + ' ' + self.duration + 'ms'
                    })
                }
            } else {
                var cssObject = (self.direction == "horizontal") ? {
                    left: "-" + position.left
                } : {
                    top: '-' + position.top
                }
                self.container.animate(cssObject,
                    self.duration,
                    function() {
                        if (self.callback && typeof(self.callback) == 'function')
                            self.callback;
                    });

            }

        },
        //当前分页的样式切换
        _pageCssChange: function(index) {
            self = this;
            self.item.removeClass('active').eq(index).addClass('active');
        },
    };

    $.fn.pageSlider = function(option) {
        return $(this).each(function() {
            var $this = $(this),
                options = typeof(option) == 'object' && option;
            var instance = $this.data("example");
            if (!instance)
                $this.data("example", new PageSlider($this, options));
            if (typeof option == 'string') instance[option]();

        });
    };

    $.fn.pageSlider.defaults = {
        domStructure: {
            container: "#container",
            sections: ".sections",
            section: ".section",
            pages: "#pages",
            item: ".item",
            active: ".active"
        },
        direction: "horizontal",
        timingFunction: "ease-in",
        duration: "500",
        loop: "false",
        pagination: "true",
        keyboard: "true",
        index: "0",
        callback: ""
    };

})(jQuery);
