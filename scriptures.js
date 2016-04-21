	var p_book_titles = "Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Solomon's Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation|1 Nephi|2 Nephi|Jacob|Enos|Jarom|Omni|Words of Mormon|Mosiah|Alma|Helaman|3 Nephi|4 Nephi|Mormon|Ether|Moroni|Doctrine and Covenants|Moses|Abraham|Joseph Smith--Matthew|Joseph Smith--History|Articles of Faith";
	var p_book_short_titles = "Gen.|Ex.|Lev.|Num.|Deut.|Josh.|Judg.|Ruth|1 Sam.|2 Sam.|1 Kgs.|2 Kgs.|1 Chr.|2 Chr.|Ezra|Neh.|Esth.|Job|Ps.|Prov.|Eccl.|Song.|Isa.|Jer.|Lam.|Ezek.|Dan.|Hosea|Joel|Amos|Obad.|Jonah|Micah|Nahum|Hab.|Zeph.|Hag.|Zech.|Mal.|Matt.|Mark|Luke|John|Acts|Rom.|1 Cor.|2 Cor.|Gal.|Eph.|Philip.|Col.|1 Thes.|2 Thes.|1 Tim.|2 Tim.|Titus|Philem.|Heb.|James|1 Pet.|2 Pet.|1 Jn.|2 Jn.|3 Jn.|Jude|Rev.|1 Ne.|2 Ne.|Jacob|Enos|Jarom|Omni|W of M|Mosiah|Alma|Hel.|3 Ne.|4 Ne.|Morm.|Ether|Moro.|D&C|Moses|Abr.|JS-M|JS-H|A of F";

	function goodtogo() {

		// Exit out if it's on an editing form. Turning it on breaks some JavaScript on theirs, when updating the div.page HTML.
		var obj = jQuery('form[id=dw__editform]');
		
		console.log(obj.length);

		if(obj.length > 0)
			return true;

		jQuery('body').append('<span id=\'scriptures\' style=\'display: none;\'></span>');

		// Remove titles (there's gotta be a way to do this in CSS ...
		jQuery('a[title]').each(function() { jQuery(this).removeAttr('title') });

		// Find all the range strings
		var pattern = "";
		// pattern = pattern + "(Genesis|Leviticus) *";
		pattern = pattern + "(" + p_book_titles + "|" + p_book_short_titles + ") *";
		// Match Book c:v which is *always* the initial string
		var chapter_verse = "(\\d+:\\d+)";
		pattern = pattern + chapter_verse;
		// Match possible Book c:v-v, c:v-v,v, c:v,v-v,v
		var following_verses = "(((( ?- ?|, ?)?\\d+)*(?!:))*)?";
		pattern = pattern + following_verses;
		// Start all over again
		pattern = pattern + "(( ?(-|,|;) ?)?";
		pattern = pattern + chapter_verse + following_verses + ")*";

		var re = new RegExp(pattern, 'g');

		var current_html = jQuery('div.page').html();
		var new_html = current_html.replace(re, '<span scripture=\'$&\'>$&</span>');
		jQuery('div.page').html(new_html);

		// Add opentips
		var matches = jQuery('span[scripture]');
		var x;
		var options = {
			fixed: true,
			tipJoint: 'bottom',
			// targetJoint: 'top left',
			target: true,
			// style: 'alert',
			background: 'white',
			borderColor: 'BBBBBB',
		}

		for(x = 0; x < matches.length; x++) {
			var title = jQuery(matches[x]).attr('scripture');
			var html = get_range_html(title);
			var element = 'span[scripture=\''+title+'\']';
			var y = 0;
			var ranges = jQuery(element);
			for(y = 0; y < ranges.length; y++) {
				jQuery(ranges[y]).opentip(html, options);
			}
		}

	}

	function get_range_html(range) {

		var element = '#scriptures span[range=\'' + range + '\']';
		var element_html = '<span range=\'' + range + '\' style=\'display: none;\'></span>';
		var count = jQuery(element).length;

		if(count == 0) {

			jQuery('#scriptures').html(jQuery('#scriptures').html() + element_html);

			var request = { f: 'get_range_html', data: range }
			
			var response = jQuery.ajax({
				dataType: "json",
				url: "/lib/tpl/incognitek/scriptures/ajax.php",
				data: request,
				async: false,
			});

			var html = response.responseText;
			
			jQuery(element).html(html);

		} else {
			html = jQuery(element).html();
		}

		return html;
	}
