const Airtable = require("airtable");

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// TEMP CACHE, BECAUSE OF REQUEST LIMITS FOR AIRTABLE API
const serverCache = {};
// CACHE ENTRYS FOR 2 MINUTES
const chacheTime = 180000;

const fields = [
  "Episode",
  "Time",
  "Songs",
  "Infos",
  "Link",
  "LinkTitle",
  "Type"
];

module.exports = (req, res) => {
  const { uri } = req.query;
  const ts = new Date().getTime();
  for (const cachedUri in serverCache) {
    if (cachedUri === uri) {
      if (ts - serverCache[cachedUri].time <= chacheTime) {
        res.status(200);
        res.send(serverCache[cachedUri].records);
        return;
      } else {
        break;
      }
    }
  }
  if (uri) {
    base("Annotations")
      .select({
        sort: [{ field: "Time" }],
        filterByFormula: "({Episode} = '" + uri + "')",
        fields: fields
      })
      .firstPage(function(error, records) {
        if (error) {
          res.status(error.statusCode);
          res.send({ error: error });
        } else {
          if (records.length) {
            res.status(200);
            records = records.map(function(record) {
              var retval = {};
              for (var i = 0; i < fields.length; i++) {
                retval[fields[i]] = record.get(fields[i]);
              }
              return retval;
            });
          } else {
            res.status(204);
          }
          serverCache[uri] = { time: ts, records };
          res.send(records);
        }
      });
  } else {
    res.status(400);
    res.send({ error: "PODCAST URI REQUIRED" });
  }
};
