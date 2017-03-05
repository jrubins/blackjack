import React, { PropTypes } from 'react';
import cn from 'classnames';

const TagPicker = ({
  handleChange,
  options,
  value: curValue,
}) => (
  <div className="tag-picker">
    {options.map(({ label, value }, i) => (
      <div
        key={i}
        className={cn('tag', {
          'tag-selected': curValue === value,
        })}
        onClick={() => handleChange(value)}
      >
        {label}
      </div>
    ))}
  </div>
);

TagPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  })),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default TagPicker;
