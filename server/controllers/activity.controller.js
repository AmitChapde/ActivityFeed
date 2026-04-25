const Activity = require("../models/Activity");

exports.createActivity = async (req, res) => {
  
  try {
    const { actorId, actorName, type, createdAt } = req.body;

    if (!actorId || !actorName || !type) {
      return res.status(400).json({
        error: "Missing required fields: actorId, actorName, and type are required."
      });
    }

    let sanitizedCreatedAt = new Date();

    if (createdAt) {
      const parsed = new Date(createdAt);

      if (!isNaN(parsed)) {
        sanitizedCreatedAt = parsed;
      }
    }

    const activity = await Activity.create({
      ...req.body,
      createdAt: sanitizedCreatedAt,
      tenantId: req.headers["x-tenant-id"]
    });

    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getActivities = async (req, res) => {
  try {
    const { cursor, limit = 20 } = req.query;
    const tenantId = req.headers["x-tenant-id"];

    const query = { tenantId };

    if (cursor) {
      const parsed = new Date(cursor);

    
      if (isNaN(parsed)) {
        return res.status(400).json({ error: "Invalid cursor" });
      }

      query.createdAt = { $lt: parsed };
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("actorName type createdAt metadata");

  
    const nextCursor =
      activities.length > 0
        ? activities[activities.length - 1].createdAt.toISOString()
        : null;

    res.json({
      data: activities,
      nextCursor,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};