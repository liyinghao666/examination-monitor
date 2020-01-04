import "./helper/webgazer.js";
const localstorageLabel = "webgazerGlobalData";
window.localStorage.setItem(localstorageLabel, null);
webgazer
  .setRegression("ridge") /* currently must set regression and tracker */
  .setTracker("clmtrackr");

webgazer.detect = (() => {
  let x = undefined;
  let y = undefined;
  const width = window.innerWidth;
  const height = window.innerHeight;
  return callback => {
    if (webgazer.getCurrentPrediction()) {
      x = webgazer.getCurrentPrediction().x;
      y = webgazer.getCurrentPrediction().y;
    }
    if (
      (x && y && x < -100) ||
      x > width + 100 ||
      y < -100 ||
      y > height + 100
    ) {
      callback(1, {
        name: "眼神漂移",
        time: Date.now()
      });
    }
  };
})();
export default webgazer;
