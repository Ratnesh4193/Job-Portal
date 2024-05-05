// Create the Chip component
const Chip = ({ name, item, allowDelete, handleChipDelete }) => {
  // Define the function to handle the delete click event
  const handleDeleteClick = () => {
    handleChipDelete(name);
  };

  // Render the Chip component
  return (
    <div className="p-1 bg-gray-300 flex items-center justify-center h-8 rounded-full text-gray-800 text-sm font-medium whitespace-nowrap align-middle transition-colors duration-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
      <div className="cursor-inherit flex items-center select-none whitespace-nowrap pl-1 pr-1">
        {item}
      </div>
      {allowDelete && (
        <div className="w-5" onClick={handleDeleteClick}>
          <svg
            className="chip-svg"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Chip;
