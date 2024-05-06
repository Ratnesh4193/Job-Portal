const CustomTextBox = (props) => {
  const { title, value, setter } = props;

  return (
    <div className="w-fit h-auto p-2 m-2 shadow-md text-left">
      {/* Title */}
      <div className="text-sm font-semibold tracking-wide text-gray-400 rounded-sm">
        {title}
      </div>

      <div className="flex flex-row flex-wrap bg-gray-200 border border-gray-300">
        {/* Dropdown for Available Items */}
        <input
          type="text"
          placeholder={title}
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="p-1 bg-white border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
    </div>
  );
};

export default CustomTextBox;
