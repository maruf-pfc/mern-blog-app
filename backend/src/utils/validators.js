// Simple validator example
const isValidTitle = (title) => {
  return (
    typeof title === "string" &&
    title.trim().length > 0 &&
    title.trim().length <= 100
  );
};

module.exports = { isValidTitle };
