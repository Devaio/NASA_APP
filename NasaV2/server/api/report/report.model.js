'use strict';

import mongoose from 'mongoose';

var ReportSchema = new mongoose.Schema({
  name: String,
  geolocation: {
    coordinates:[]
  },
  year: String,
  location: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Report', ReportSchema);
