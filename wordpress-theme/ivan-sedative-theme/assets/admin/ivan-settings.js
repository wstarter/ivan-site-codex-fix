/* Ivan Settings — WP media picker for asset fields. */
(function ($) {
	'use strict';
	$(document).on('click', '.ivan-media-pick', function (e) {
		e.preventDefault();
		var $btn   = $(this);
		var target = $btn.data('target');
		var frame  = wp.media({
			title: 'Choose image',
			multiple: false,
			library: { type: 'image' },
			button: { text: 'Use this image' }
		});
		frame.on('select', function () {
			var att = frame.state().get('selection').first().toJSON();
			$('#' + target).val(att.url);
		});
		frame.open();
	});
})(jQuery);