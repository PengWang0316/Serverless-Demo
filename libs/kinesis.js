'use strict';

const parsePayload = record => JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('utf8'));

/**
 * Return a parsed object array for from a Kinesis event data (Binary).
 * @param {Object} event is a Kinesis event.
 * @return {Array} Return an array contains objects that has parsed event information.
 */
const getRecords = event => event.Records.map(parsePayload);

module.exports = getRecords;
