const getAll = async (req, res, next) => {
  try {
    res.json({ notifications: [], unreadCount: 0 });
  } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
  try {
    res.json({ message: 'Notification marked as read' });
  } catch (err) { next(err); }
};

const markAllRead = async (req, res, next) => {
  try {
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

module.exports = { getAll, markRead, markAllRead };
