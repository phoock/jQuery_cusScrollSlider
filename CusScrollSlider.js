(function(win, doc, $) {
    //构造函数CusScrollSlider接受一个参数options,调用内部的_init方法
    function CusScrollSlider(options) {
        this._init(options);
    }

    //用extend方法将对象写入到prototype中
    $.extend(CusScrollSlider.prototype, {
        //定义_init方法
        _init: function(options) {
            var self = this;
            //定义内部参数
            self.options = {
                contSelector: "",
                barSelector: "",
                sliderSelector: "",
                wheelLevel: 30,
                tabSelector: ".tab-item",
                tabActiveClass: "tab-active",
                anchorSelector: ".anchor",
                correctSelector: ".correct-bot",
                articleSelector: ".scroll-ol"
            }
            //将传入的参数与内部定义的默认参数合并
            $.extend(true, self.options, options);

            //调用初始化dom事件的方法
            self._initDomEvent();
        },

        //初始化dom事件
        _initDomEvent: function() {
            var self = this;
            //将dom对象转换为jquery对象
            self.$cont = $(self.options.contSelector);
            self.$bar = $(self.options.barSelector);
            self.$slider = $(self.options.sliderSelector);
            self.$doc = $(doc);
            self.$tab = $(self.options.tabSelector);
            self.$anchors = $(self.options.anchorSelector);
            self.$correct = $(self.options.correctSelector);
            self.$article = $(self.options.articleSelector);


            //绑定事件
            self._initCorrectHeight();
            self._initSliderEvent()._bindContEvent();
            self._initTabEvent();
        },
        _initCorrectHeight() {
            var self = this;
            var correct = self.$correct;
            var cont = self.$cont;
            var lastArti = self.$article.last();
            if (lastArti.height() < cont.height()) {
                lastArti.css("padding-bottom", "1px");
                var theValue = cont.height() - lastArti.outerHeight() - self.$anchors.height();
                correct.css("height", theValue);
            }
        },
        _initSliderEvent: function() {
            var self = this;
            var slider = self.$slider;
            var sliderEl = slider[0];
            var scrollRate = self.getMaxContScroll() / self.getMaxSliderScroll();
            var pageyStart = 0;
            var contScrollStart = 0;
            function contScrollFunc(e) {
                e.preventDefault();
                var theValue = contScrollStart + scrollRate * (e.pageY - pageyStart);
                self.scrollTo(theValue);
            }
            if (sliderEl) {
                slider.on({
                    "mousedown": function(e) {
                        e.preventDefault();
                        pageyStart = e.pageY;
                        contScrollStart = self.$cont.scrollTop();
                        self.$doc.on({
                            "mousemove.scroll": contScrollFunc,
                            "mouseup.scroll": function(e) {
                                e.preventDefault();
                                self.$doc.off(".scroll")
                            }
                        })
                    }
                })
            }
            return self;
        },
        _bindContEvent: function() {
            var self = this;
            self.$cont.on({
                "scroll": function(e) {
                    self.$slider[0].style.top = self.getSliderPosition() + "px";
                },
                "mousewheel DOMmouseScroll": function(e) {
                    var oEv = e.originalEvent;
                    var wheelRange = oEv.wheelDelta
                        ? -(oEv.wheelDelta / 120)
                        : (oEv.detail / 3);
                    self.scrollTo(self.$cont.scrollTop() + wheelRange * self.options.wheelLevel);
                }
            })
            return self;
        },
        _initTabEvent: function() {
            var self = this;
            self.$tab.on({
                "click": function(e) {

                    var tabIndex = $(this).index();
                    self.changeTabSelect(tabIndex)
                    //同步内容
                    var anchorArr = self.getAnchorsPos();
                    self.scrollTo(anchorArr[tabIndex])
                }
            })
        },
        //相关的辅助方法
        getMaxContScroll: function() {
            var self = this;
            return Math.max(self.$cont.height(), self.$cont[0].scrollHeight) - self.$cont.height();
        },
        getMaxSliderScroll: function() {
            var self = this;
            return self.$bar.height() - self.$slider.height();
        },
        getSliderPosition: function() {
            var self = this;
            return self.$cont[0].scrollTop / self.getMaxContScroll() * self.getMaxSliderScroll();
        },
        changeTabSelect(index) {
            var self = this;
            var active = self.options.tabActiveClass;
            self.$tab.eq(index).addClass(active).siblings().removeClass(active);
        },
        getAnchorsPos() {
            var self = this;
            var AnchorArr = [];
            var $anchor = self.$anchors;
            for (var i = 0; i < $anchor.length; i++) {
                var theValue = self.$cont.scrollTop() + $anchor.eq(i).position().top;
                AnchorArr.push(theValue);
            }
            return AnchorArr;
        },
        //scrollTo
        scrollTo: function(value) {
            var self = this;
            self.$cont.scrollTop(value);

            var anchorsArr = self.getAnchorsPos();
            var nowContScroll = self.$cont.scrollTop();
            function getIndex() {
                for (var i = anchorsArr.length; i > 0; i--) {
                    if (nowContScroll >= anchorsArr[i])
                        return i;
                    else {
                        continue;
                    }
                }
            }
            self.changeTabSelect(getIndex() + 1);
        }
    })
    win.CusScrollSlider = CusScrollSlider;
})(window, document, jQuery)
