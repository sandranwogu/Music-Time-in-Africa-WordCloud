data = [];

function getData(csvdata) {
  data = csvdata.split('\n');
}

function search(text) {
  if (text.length <= 0)
    return '';

  transcripts = '';

  terms = text.split(' ');
  // console.log(terms);

  for (i = 0; i < data.length; i++) {
    transcript = data[i].toLowerCase();
    added = false;

    for (j = 0; j < terms.length; j++) {
      term = terms[j];

      if (transcript.includes(term.toLowerCase()) && added == false) {
        transcripts = transcripts.concat(transcript);
        added = true;
      }
    }
  }

  return transcripts;
}
