/*
* jQuery.fn.slider( options );
*
* Eternal slide plugin, slide your content for ever.
*
* USAGE:
* $('.element').slider();
* $('.element').slider({
*     direction: 'ltr or rtl', // DEF: ltr
*     vertical: 'true, false', // DEF: false
*     speed: 'in millisec', // DEF: 20000
*     easing: 'require easing plugin', // DEF: linear
* });
*
* Version 0.5.2
* www.labs.skengdon.com/slider/
* www.labs.skengdon.com/slider/js/slider.min.js
*/
;(function($){
	$.fn.slider = function( options ) {
		var animater = function( e, settings ) {
			
			$holder = $(e);
			
			if ( settings.vertical ) {
				var tf = -(settings.cHeight-settings.tHeight);
			} else {
				var tf = -(settings.cWidth-settings.tWidth);
			};
			
			if ( settings.direction == 'ltr' ) {
				if ( settings.vertical ) {
					$holder.css({ top: 0 });
					$holder.animate( { top: tf }, settings.speed, settings.easing, function() { animater( e, settings ); } );
				} else {
					$holder.css({ left: 0 });
					$holder.animate( { left: tf }, settings.speed, settings.easing, function() { animater( e, settings ); } );
				}
			} else {
				if ( settings.vertical ) {
					$holder.css({ top: tf });
					$holder.animate( { top: 0 }, settings.speed, settings.easing, function() { animater( e, settings ); } );
				} else {
					$holder.css({ left: tf });
					$holder.animate( { left: 0 }, settings.speed, settings.easing, function() { animater( e, settings ); } );
				}
			}
		};
		
		return this.each(function() {
			var settings = {
				direction: 'ltr',
				vertical: false,
				speed: 20000,
				easing: 'linear'
			};
			$.extend( settings, options );
		
			settings.tHeight = $(this).height();
			settings.tWidth = $(this).width();
			var $kids = $(this).children();
			
			if ( settings.vertical ) {
				settings.cWidth = settings.tWidth;
				settings.cHeight = settings.tHeight * ($kids.length + 1);
			} else {
				settings.cWidth = settings.tWidth * ($kids.length + 1);
				settings.cHeight = settings.tHeight;
			};
			
			// holder to animation
			$kids.wrapAll('<div></div>');
			var $holder = $(this).find('div:first');
			$holder.css({ position: 'relative' });
			$holder.css({ width: settings.cWidth, height: settings.cHeight });
			
			if (settings.direction == 'ltr') {
				$holder.append( $kids.first().clone() );
			} else {
				$holder.prepend( $kids.last().clone() );
			};
			
			var $kids = $holder.children();
	
			$(this).css({ overflow: 'hidden', whiteSpace: 'nowrap' });
			$(this).css({ width: settings.tWidth, height: settings.tHeight });
			
			$kids.css({ 'float': 'left' });
			$kids.css({ width: settings.tWidth, height: settings.tHeight });
			
			animater( $holder, settings );
		});
	};
}(jQuery));
