const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  type: { type: String, required: true },
  entityId: { type: String },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

activitySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);