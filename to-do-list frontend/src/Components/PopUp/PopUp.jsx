

import PropTypes from 'prop-types'; // Import PropTypes
import './PopUp.css';

const PopUp = ({ isVisible, onClose, onConfirm, message }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <div className="modal-buttons">
          <button className="modal-btn confirm" onClick={onConfirm}>Yes</button>
          <button className="modal-btn cancel" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
PopUp.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default PopUp;




// import PropTypes from 'prop-types';
// import './PopUp.css';

// const PopUp = ({ isVisible, onClose, onConfirm, message }) => {
//   if (!isVisible) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>{message}</h2>
//         <div className="modal-buttons">
//           <button className="modal-btn confirm" onClick={onConfirm}>
//             Yes
//           </button>
//           <button className="modal-btn cancel" onClick={onClose}>
//             No
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// PopUp.propTypes = {
//   isVisible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onConfirm: PropTypes.func.isRequired,
//   message: PropTypes.string.isRequired,
// };

// export default PopUp;
