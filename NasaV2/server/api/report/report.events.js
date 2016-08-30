/**
 * Report model events
 */

'use strict';

import {EventEmitter} from 'events';
import Report from './report.model';
var ReportEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReportEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Report.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ReportEvents.emit(event + ':' + doc._id, doc);
    ReportEvents.emit(event, doc);
  }
}

export default ReportEvents;
