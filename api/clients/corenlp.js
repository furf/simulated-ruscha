import request from 'request';

// CoreNLP singleton instance stored as promise.
let instance = null;

export function createCoreNLPClient(url) {
  if (!instance) {
    instance = {
      parse(string, callback) {
        const annotators = [
          'tokenize',
          'ssplit',
          'pos',
          'ner',
          'depparse',
          'openie',
        ];
        const openie = true;
        const options = {
          annotators: annotators.join(','),
          'openie.resolve_coref': openie.toString(),
        };
        const properties = encodeURIComponent(JSON.stringify(options));
        const uri = `${url}?properties=${properties}`;

        request.post(uri, { form: string }, (error, response, body) => {
          if (error) {
            return callback(error);
          }
          try {
            const clean = body.split('\u0000').join('');
            const results = JSON.parse(clean);
            callback(null, results);
          } catch(error) {
            console.log(4, error);
            callback(error);
          }
        });
      }
    };
  }

  return instance;
}
