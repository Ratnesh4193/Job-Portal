import { useCallback, useEffect, useState } from "react";
import Chip from "./Chip";

const ChipComponent = (props) => {
  const { items, selectedItems, addChip, removeChip, title } = props;
  const [availableItems, setAvailableItems] = useState(items);
  const [alreadyHighlighted, setAlreadyHighlighted] = useState(0);
  const [filterTerm, setFilterTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(availableItems);

  // This useEffect hook filters the availableItems based on the filterTerm and updates the filteredItems state
  useEffect(() => {
    // Filter the availableItems based on the filterTerm
    const filteredItems =
      availableItems.length === 0
        ? []
        : availableItems.filter((item) =>
            item.toLowerCase().includes(filterTerm.toLowerCase())
          );

    // Update the filteredItems state with the filtered result
    setFilteredItems(filteredItems);
  }, [availableItems, filterTerm]);

  // This handleChipClick function adds the selected item to the selectedItems array,
  // removes the item from the availableItems array, and resets the filter term
  const handleChipClick = useCallback(
    (item) => {
      console.log("handleChipClick-item: ", item);
      // Add the selected item to the selectedItems array
      addChip(item);

      // Remove the item from the availableItems array
      setAvailableItems((prevAvailableItems) =>
        prevAvailableItems.filter((i) => i !== item)
      );

      // Reset the filter term
      setFilterTerm("");
    },
    [selectedItems, availableItems, addChip, setAvailableItems]
  );

  // This handleFilterChange function updates the filterTerm state and resets the alreadyHighlighted value
  const handleFilterChange = useCallback((e) => {
    // Get the search term from the event target value
    const searchTerm = e.target.value;

    // Update the filterTerm state with the search term
    setFilterTerm(searchTerm);

    // Reset the alreadyHighlighted value to 0
    setAlreadyHighlighted(0);
  }, []);

  // This handleChipDelete function removes the deletedItem from the selectedItems array
  // and adds it to the availableItems array
  const handleChipDelete = useCallback(
    (deletedItem) => {
      // Remove the deletedItem from the selectedItems array
      removeChip(deletedItem);

      // Add the deletedItem to the availableItems array
      setAvailableItems((prevAvailableItems) => [
        ...prevAvailableItems,
        deletedItem,
      ]);
    },
    [selectedItems, availableItems, addChip, setAvailableItems]
  );

  // This handleKeyDownPress function handles the keydown event when the filter term is empty
  // and the backspace key is pressed and there are selected items
  const handleKeyDownPress = useCallback(
    (e) => {
      // Check if the filter term is empty and the backspace key is pressed
      if (
        e.target.value === "" &&
        e.key === "Backspace" &&
        selectedItems.length
      ) {
        // Check if alreadyHighlighted is truthy
        if (alreadyHighlighted) {
          // Get the last element from the selectedItems array
          const lastElement = selectedItems[selectedItems.length - 1];

          // Call the handleChipDelete function with the lastElement
          handleChipDelete(lastElement);

          // Reset the alreadyHighlighted value to 0
          setAlreadyHighlighted(0);
        } else {
          // Set the alreadyHighlighted value to 1
          setAlreadyHighlighted(1);
        }
      }
    },
    [alreadyHighlighted, selectedItems, handleChipDelete]
  );

  return (
    <div
      className="w-fit h-auto p-2 m-2 shadow-md text-left"
      onKeyDown={handleKeyDownPress}
    >
      {/* Title */}
      <div className="text-sm font-semibold tracking-wide text-gray-400 rounded-sm">
        {title}
      </div>

      {/* Selected Items */}
      <div className="flex flex-row flex-wrap bg-gray-200 border border-gray-300">
        {selectedItems.map((item, key) => (
          <div
            key={key}
            className={`w-fit ${
              key === selectedItems.length - 1 &&
              alreadyHighlighted &&
              "border border-red-500 rounded-lg"
            }`}
          >
            <Chip
              item={item}
              name={item}
              allowDelete={true}
              handleChipDelete={handleChipDelete}
            />
          </div>
        ))}

        {/* Dropdown for Available Items */}
        {availableItems.length > 0 && (
          <select
            value=""
            onChange={(e) => handleChipClick(e.target.value)}
            className="block appearance-none w-fit bg-white border border-gray-200 text-gray-700 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value=""></option>
            {availableItems.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default ChipComponent;
