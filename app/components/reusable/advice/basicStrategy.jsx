import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  isBasicStrategyOpen,
} from '../../../reducers';
import {
  closeBasicStrategy,
} from '../../../actions/ui';

import CloseIcon from '../icons/close';

const BasicStrategyAdvice = ({
  basicStrategyError,
  basicStrategyOpen,
  basicStrategyStreak,
  closeBasicStrategy,
}) => {
  if (!basicStrategyOpen) {
    return null;
  }

  return (
    <div className="basic-strategy-notes">
      <div
        className="basic-strategy-close"
        onClick={closeBasicStrategy}
      >
        <CloseIcon />
      </div>
      <div className="basic-strategy-header">
        <h3>Basic Strategy Advisor</h3>
      </div>
      <div className="basic-strategy-content">
        <div className="basic-strategy-streak">
          <span className="streak-label">
            Streak
          </span>
          x{basicStrategyStreak}
        </div>
        <div className="basic-strategy-comment">
          {basicStrategyError}
        </div>
      </div>
    </div>
  );
};

BasicStrategyAdvice.propTypes = {
  basicStrategyOpen: PropTypes.bool.isRequired,
  closeBasicStrategy: PropTypes.func.isRequired,

  basicStrategyError: PropTypes.string,
  basicStrategyStreak: PropTypes.number,
};

BasicStrategyAdvice.defaultProps = {
  basicStrategyStreak: 0,
};

export default connect(state => ({
  basicStrategyOpen: isBasicStrategyOpen(state),
}), {
  closeBasicStrategy,
})(BasicStrategyAdvice);
