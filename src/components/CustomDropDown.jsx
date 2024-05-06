const CustomDropDown = (props) => {
  const { title, items, selectedItem, setter } = props;

  /**
   * Handles the click event when an item is clicked in the dropdown menu.
   * Updates the selected item with the clicked item.
   *
   * @param item - The clicked item
   */
  const handleItemClick = (item) => {
    setter(item);
  };

  return (
    <div className="w-fit h-auto p-2 m-2 shadow-md text-left">
      {/* Title */}
      <div className="text-sm font-semibold tracking-wide text-gray-400 rounded-sm">
        {title}
      </div>

      <div className="flex flex-row flex-wrap bg-gray-200 border border-gray-300">
        {/* Dropdown for Available Items */}
        <select
          value={selectedItem}
          onChange={(e) => handleItemClick(e.target.value)}
          className="block appearance-none w-fit bg-white border border-gray-200 text-gray-700 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value="">Select an item</option>
          {items.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomDropDown;
