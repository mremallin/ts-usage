var UI = require('ui');
var ajax = require('ajax');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Teksavvy Usage',
  subtitle:'Fetching...'
});

// Display the Card
card.show();
update_usage_data(card);

card.on('click', 'select', update_display_usage_data);

function update_display_usage_data() {
    update_usage_data(card);
}

function update_usage_data(the_card) {
    card.subtitle('Fetching...');
    // Make the request
    ajax(
    {
        url: 'https://api.teksavvy.com/web/Usage/UsageSummaryRecords?$filter=IsCurrent%20eq%20true',
        method: 'get',
        type: 'json',
        headers: {
            'TekSavvy-APIKey' : '07E2838AF054BECA9AD9AA8101E0B9AE'
        }
    },
        function(data) {
            // Success!
            console.log("Successfully fetched usage data!");

            // Extract data
            var on_peak_dl = data.value[0].OnPeakDownload;
            var on_peak_ul = data.value[0].OnPeakUpload;
            var off_peak_dl = data.value[0].OffPeakDownload;
            var off_peak_ul = data.value[0].OffPeakUpload;
            var period_start = data.value[0].StartDate.split('T')[0];
            var period_end = data.value[0].EndDate.split('T')[0];

            // Show to user
            the_card.subtitle('Total: ' + (on_peak_ul + on_peak_dl) + 'Gb');
            the_card.body('On Peak DL: ' + on_peak_dl + 'Gb\n' +
                          'On Peak UL: ' + on_peak_ul + 'Gb\n' +
                          'Off Peak DL: ' + off_peak_dl + 'Gb\n' +
                          'Off Peak UL: ' + off_peak_ul + 'Gb\n' +
                          '\n' +
                          'Start: ' + period_start + '\n' +
                          'End: ' + period_end + '\n'
                         );
            the_card.style('small');
            the_card.scrollable(true);
        },
        function(error, status, request) {
            // Failure!
            card.subtitle('');
            card.body('Failed to get usage data!');
            console.log('Failed fetching usage data: ' + error + ' status: ' + status + ' request: ' + request);
        }
    );
}
