import { Button } from "./Button";

const ScorePanel = ({
  teamName,
  teamScore,
  teamWickets,
  teamBalls,
  setTeamName,
  setTeamScore,
  setTeamWickets,
  setTeamBalls,
  uploadLogo,
  setLogoUpload,
  handleTeamName,
  handleTeamScore,
  handleTeamWickets,
  handleTeamBalls,
  id,
}) => {
  return (
    <div className="sectionDiv">
      <h3>Enter Team {id}: </h3>
      <input
        placeholder="Type here..."
        value={teamName}
        style={{ textAlign: "left" }}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <div>
        <input type="file" onChange={(e) => setLogoUpload(e.target.files[0])} />
      </div>
      <button
        className="submitBtn"
        onClick={() => {
          handleTeamName();
          uploadLogo(id);
        }}
      >
        Submit
      </button>
      <h3>Team 1 Score: </h3>
      <input
        placeholder="Score"
        type="number"
        min={0}
        value={teamScore}
        onChange={(e) => setTeamScore(Number(e.target.value))}
      />
      <div className="scoreBtnDiv">
        <Button
          style={{ backgroundColor: "orangered" }}
          onClick={() => handleTeamScore(-1)}
          label={"-1"}
        />
        <Button style={{}} onClick={() => handleTeamScore(1)} label={"1"} />
        <Button style={{}} onClick={() => handleTeamScore(2)} label={"2"} />
        <Button style={{}} onClick={() => handleTeamScore(4)} label={"4"} />
        <Button style={{}} onClick={() => handleTeamScore(6)} label={"6"} />
      </div>
      <div className="wcktBallsDivContainer">
        <label>Wickets</label>
        <div className="wcktBallsDiv">
          <input
            placeholder="Wickets"
            type="number"
            min={0}
            max={10}
            value={teamWickets}
            onChange={(e) => setTeamWickets(Number(e.target.value))}
          />
          <Button
            style={{ backgroundColor: "orangered" }}
            onClick={() => handleTeamWickets(-1)}
            label={"-1"}
          />
          <Button style={{}} onClick={() => handleTeamWickets(1)} label={"1"} />
        </div>
        <label>Balls</label>
        <div className="wcktBallsDiv">
          <input
            placeholder="Balls"
            type="number"
            min={0}
            max={99}
            value={teamBalls}
            onChange={(e) => setTeamBalls(Number(e.target.value))}
          />
          <Button
            style={{ backgroundColor: "orangered" }}
            onClick={() => handleTeamBalls(-1)}
            label={"-1"}
          />
          <Button style={{}} onClick={() => handleTeamBalls(1)} label={"1"} />
        </div>
      </div>
    </div>
  );
};

export default ScorePanel;
