
(function($) {
	function absolutize(element) {
		element = $(element);
		if (element.css('position') == 'absolute') return;
		var offsets = element.offset();
		var top = offsets[1];
		var left = offsets[0];
		var width = element.clientWidth;
		var height = element.clientHeight;

	    element._originalLeft = left - parseFloat(element.css('left')  || 0);
	    element._originalTop = top  - parseFloat(element.css('top') || 0);
	    element._originalWidth = element.width();
	    element._originalHeight = element.height();

	    element.css('position', 'absolute');
	    element.css('top', top + 'px');
	    element.css('left', left + 'px');
	    element.width(width + 'px');
	    element.height(height + 'px');
	    return element;
	}
	function CoverFlow(elem, options) {
		var _this = this;
		this.options = options;
		this.useCaptions = this.options.captions;
		this.elem = elem;
		$(this.elem).css({overflow: 'hidden', position: 'relative'});
		
		this.stack = $(this.elem).children().get();
		
	
		
		if(this.options.captions != false) {
			this.captions = [];
			$(this.stack).each(function(i) {
				var alt = $(this).attr('alt');
				_this.captions[i] = (alt) ? alt : '';
			});
			this.captionsCount = this.captions.length;
		}
		if(this.options.useReflection) {
			$(this.stack).reflect();
			this.stack = $(this.elem).children().get();
		}
		this.stackCount = this.stack.length;
		if(this.useCaptions) {
			this.captionHolder = $('<div/>').addClass('captionHolder').css({
				width: '100%',
				textAlign: 'center',
				position: 'absolute',
				left: '0px',
				top: ($(elem).height() - 80) + 'px'
			}).appendTo(this.elem).get();
		}
		
		this.currPos = this.options.startIndex - 1;
		this.currIndex = this.currPos;
		/* slider */
		if(this.options.slider) {
			this.sliderContainer = $('<div/>').css({
				width: '200px',
				height: '10px',
				position: 'absolute',
				top: ($(this.elem).height() - 30) + 'px',
				left: ($(this.elem).width() / 2  - (137 / 2)) + 'px'
			}).get();

			this.sliderTrack = $('<div/>').addClass('sliderTrack').get();
			
			this.sliderHandle = $('<div/>').addClass('sliderHandle').get();
			$(this.sliderHandle).appendTo(this.sliderTrack);
			$(this.sliderTrack).appendTo(this.sliderContainer);
			$(this.sliderContainer).appendTo(this.elem);
			$(this.sliderTrack).slider({
				handle: ".sliderHandle",
				minValue: 0,
				maxValue: this.getStackCount() - 1,
				startValue: this.getCurrentPos(),
				slide: function(e, ui) { _this.handleSlider(Math.round(ui.value)); },
				change: function(e, ui) {
					var v = Math.round(ui.value);
					if(v != _this.getCurrentPos()) _this.handleSlider(v);
				}
			});
		}
		this.timer = 0;
		/* sets up click listener on all the elements in the stack */
		$(this.stack).click(function() {
			_this.handleClick(this);
		});
		/*handle key events*/
		$(this.elem).keydown(function(event){
		    _this.handleKey(event);
		});
		
		/* sets up mouse wheel listener */
		$(this.elem).mousewheel(function(event, delta) {
			delta = (delta >= 0) ? 1 : -1;
			_this.handleWheel(delta);
			return false;
		});
		
		this.goTo(this.currPos);
		this.autoplayer = null;
		/*
		if(this.options.autoplay) {
			this.autoplayer = new PeriodicalExecuter(this.autoPlay.bind(this), this.options.autoplayInterval);
		}
		*/
	}
	CoverFlow.prototype = {
		autoPlay: function() {
			if((this.currIndex + 2) > this.stackCount) {
				this.currIndex = 0;
			}
			this.currIndex = this.currIndex + 1;
			this.goTo(this.currIndex);
		},
		handleWindowResize: function(event) {
		},
		handleWheel: function(d) {
			var index = this.currIndex + d;
			if(index >= 0 && index < this.stackCount) {
				this.goTo(index);
				
			}
		},
		handleSliderChange: function(v) {
			this.goTo(v);
		},
		handleKey: function(v){
		 
		   var cIndex = this.currIndex;
		   
		     /*right arrow key*/
		    if(v.keyCode == 39)
		    {
		       	if( (cIndex +1) >= 0 && (cIndex+1) < this.stackCount) 
		       	{
		            this.goTo(cIndex +1);
		            
		            
		        }
		        
		    }else{
		    
		       /*left arrow key*/
		       if(v.keyCode == 37)
		       {
		          if( (cIndex -1) >= 0 && (cIndex-1) < this.stackCount) 
		       	  {  
		          this.goTo(cIndex -1);
		          }
		       
		       }
		    }
		},
		handleSlider: function(v) {
			if(typeof(v) !== 'undefined') this.goTo(v);
		},
		handleClick: function(elem) {
			v = elem.getAttribute('index');
			this.goTo(v);
			this.updateSlider(v);
		},
		getCurrentPos: function() {
			return this.currPos;
		},
		
		goTo: function(index) {
			this.currIndex = index;
			this.slideTo(index * this.options.flex * -1);
			if(this.useCaptions) {
				$(this.captionHolder).html(this.captions[Math.round(index)]);
			}
		},
		updateSlider: function(index) {
			if(this.options.slider) $(this.sliderTrack).slider('moveTo', index, true);
		},
		step: function() {
			if(this.target < this.currPos - 1 || this.target > this.currPos + 1) {
				this.moveTo(this.currPos + (this.target - this.currPos) / 5);
				var _this = this;
				window.setTimeout(function(){
					_this.step();
				}, this.options.interval);
				this.timer = 1;
			} else {
				this.timer = 0;
			}
		},
		slideTo: function(x) {
			this.target = x;
			if(this.timer == 0) {
				var _this = this;
				window.setTimeout(function(){
					_this.step();
				}, this.options.interval);
				this.timer = 1;
			}
		},

		moveTo: function(currentPos) {
			var x = currentPos;
			this.currPos = currentPos;
			var width = $(this.elem).width();
			var height = $(this.elem).height();
			
			var top = this.elem.offsetTop;
			var size = width * 0.5;
			var biggest = height;
			var zIndex = this.stackCount;
			var _this = this;
			$(this.stack).each(function(index) {
				absolutize(this);
				this.setAttribute('index', index);
				var z = Math.sqrt(10000 + x * x * 1) + 100;
				var xs = x / z * size + size;
				$(this).css({
					left: (xs - 40 / z * biggest) + 'px',
					top: (30 / z * size + 0) + 'px',
					width: (100 / z * biggest) + 'px',
					height: (110.25 / z * biggest) + 'px',
					zIndex: zIndex
				});
				if(x < 0) zIndex++;
				else zIndex--;
				x += _this.options.flex;
			});
		},
		getStackCount: function() {
			return this.stackCount;
		}
	};

	jQuery.fn.coverflow = function(options) {
		options = $.extend({
			startIndex: 5,
			interval: 60,
			slider: true, 
			flex: 100,
			captions: false,
			autoplay: false,
			autoplayInterval: 5,
			useReflection: true
		}, options);
		return this.each(function() {
			new CoverFlow(this, options);
		});
	};
})(jQuery);