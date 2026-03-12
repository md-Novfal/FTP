const sendMessage = async (req, res, next) => {
  try {
    // TODO: Save message to DB and emit via Socket.io
    res.status(201).json({ message: 'Message sent' });
  } catch (err) { next(err); }
};

const getMessages = async (req, res, next) => {
  try {
    // TODO: Paginated message history for a room
    res.json({ messages: [], total: 0 });
  } catch (err) { next(err); }
};

module.exports = { sendMessage, getMessages };
