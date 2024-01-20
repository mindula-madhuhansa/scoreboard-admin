import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { db, storage } from "./config/firebase";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import ScorePanel from "./components/ScorePanel";

function App() {
  const [teams, setTeams] = useState({
    team1: { name: "", score: 0, wickets: 0, balls: 0 },
    team2: { name: "", score: 0, wickets: 0, balls: 0 },
  });
  const [logoUpload, setLogoUpload] = useState();

  const [matchState, setMatchState] = useState({
    matchNumber: "Match Number 1",
    totalBalls: 0,
  });

  const handleTotalBalls = (event) => {
    const newTotalBalls = event.target.value;
    setMatchState((prevState) => ({ ...prevState, totalBalls: newTotalBalls }));
  };

  const handleMatchNumber = (event) => {
    const newMatchNumber = event.target.value;
    setMatchState((prevState) => ({
      ...prevState,
      matchNumber: newMatchNumber,
    }));
  };

  // update match state
  const onSubmitMatchState = async () => {
    try {
      await setDoc(doc(db, "matchState", "nowMatchState"), {
        matchNumber: matchState.matchNumber,
        totalBalls: matchState.totalBalls,
      });
    } catch (error) {
      alert("Error fetching team data:", error);
    }
  };

  // update team 1 name
  const onSubmitTeam1Name = async () => {
    try {
      await setDoc(doc(db, "teamDetails", "team1Details"), {
        teamName: teams.team1.name,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // update team 2 name
  const onSubmitTeam2Name = async () => {
    try {
      await setDoc(doc(db, "teamDetails", "team2Details"), {
        teamName: teams.team2.name,
      });
    } catch (error) {
      alert("Error fetching team data:", error);
    }
  };

  // update team details on database
  const updateTeamDetails = async (team, details) => {
    try {
      await setDoc(doc(db, "teamDetails", `team${team}Details`), details, {
        merge: true,
      });
    } catch (error) {
      alert("Error updating team data:", error);
    }
  };

  // upload team logo
  const uploadLogo = async (id) => {
    if (!logoUpload) return;
    const teamName = teams[`team${id}`].name;
    const filteredTeamName = teamName.replace(/\s+/g, "_");
    const filesFolderRef = ref(storage, `teamLogos/${filteredTeamName}`);

    try {
      await uploadBytes(filesFolderRef, logoUpload);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    updateTeamDetails(1, {
      teamScore: teams.team1.score,
      teamWickets: teams.team1.wickets,
      teamBalls: teams.team1.balls,
    });
    updateTeamDetails(2, {
      teamScore: teams.team2.score,
      teamWickets: teams.team2.wickets,
      teamBalls: teams.team2.balls,
    });
  }, [teams]);

  // show data
  const getTeamList = async () => {
    try {
      const team1Ref = doc(db, "teamDetails", "team1Details");
      const team2Ref = doc(db, "teamDetails", "team2Details");

      onSnapshot(team1Ref, (team1DocSnap) => {
        const team1Data = team1DocSnap.exists() ? team1DocSnap.data() : null;
        setTeams((prevTeams) => ({
          ...prevTeams,
          team1: {
            ...prevTeams.team1,
            name: team1Data?.teamName || "",
            score: team1Data?.teamScore || 0,
            wickets: team1Data?.teamWickets || 0,
            balls: team1Data?.teamBalls || 0,
          },
        }));
      });

      onSnapshot(team2Ref, (team2DocSnap) => {
        const team2Data = team2DocSnap.exists() ? team2DocSnap.data() : null;
        setTeams((prevTeams) => ({
          ...prevTeams,
          team2: {
            ...prevTeams.team2,
            name: team2Data?.teamName || "",
            score: team2Data?.teamScore || 0,
            wickets: team2Data?.teamWickets || 0,
            balls: team2Data?.teamBalls || 0,
          },
        }));
      });
    } catch (error) {
      alert("Error fetching team data: ", error);
    }
  };

  useEffect(() => {
    getTeamList();
  }, []);

  // update team score
  const handleTeamScore = useCallback(
    (team, runs) => {
      setTeams((prevTeams) => ({
        ...prevTeams,
        [`${team === 1 ? "team1" : "team2"}`]: {
          ...prevTeams[`${team === 1 ? "team1" : "team2"}`],
          score: prevTeams[`${team === 1 ? "team1" : "team2"}`].score + runs,
        },
      }));
    },
    [setTeams]
  );

  // update team wickets
  const handleTeamWickets = useCallback(
    (team, wickets) => {
      setTeams((prevTeams) => ({
        ...prevTeams,
        [`${team === 1 ? "team1" : "team2"}`]: {
          ...prevTeams[`${team === 1 ? "team1" : "team2"}`],
          wickets:
            prevTeams[`${team === 1 ? "team1" : "team2"}`].wickets + wickets,
        },
      }));
    },
    [setTeams]
  );
  // update team balls
  const handleTeamBalls = useCallback(
    (team, balls) => {
      setTeams((prevTeams) => ({
        ...prevTeams,
        [`${team === 1 ? "team1" : "team2"}`]: {
          ...prevTeams[`${team === 1 ? "team1" : "team2"}`],
          balls: prevTeams[`${team === 1 ? "team1" : "team2"}`].balls + balls,
        },
      }));
    },
    [setTeams]
  );

  return (
    <div className="container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3>Total Balls: </h3>
        <input
          value={matchState.totalBalls}
          placeholder="Type here..."
          style={{ textAlign: "left", marginTop: 4 }}
          onChange={handleTotalBalls}
        />
        <h3 style={{ marginTop: 12 }}>Match Name</h3>
        <input
          placeholder="Type here..."
          value={matchState.matchNumber}
          style={{ textAlign: "left", marginTop: 4 }}
          type="text"
          onChange={handleMatchNumber}
        />
        <button
          className="submitBtn"
          onClick={onSubmitMatchState}
          style={{ marginTop: 8, marginBottom: 8 }}
        >
          Submit
        </button>
      </div>
      <ScorePanel
        id={1}
        teamName={teams.team1.name}
        teamScore={teams.team1.score}
        teamWickets={teams.team1.wickets}
        teamBalls={teams.team1.balls}
        setTeamName={(newName) =>
          setTeams({ ...teams, team1: { ...teams.team1, name: newName } })
        }
        setTeamScore={(newScore) =>
          setTeams({ ...teams, team1: { ...teams.team1, name: newScore } })
        }
        setTeamWickets={(newWickets) =>
          setTeams({ ...teams, team1: { ...teams.team1, name: newWickets } })
        }
        setTeamBalls={(newBalls) =>
          setTeams({ ...teams, team1: { ...teams.team1, name: newBalls } })
        }
        handleTeamName={onSubmitTeam1Name}
        handleTeamScore={(runs) => handleTeamScore(1, runs)}
        handleTeamWickets={(wickets) => handleTeamWickets(1, wickets)}
        handleTeamBalls={(balls) => handleTeamBalls(1, balls)}
        logoUpload={logoUpload}
        setLogoUpload={setLogoUpload}
        uploadLogo={uploadLogo}
      />

      <ScorePanel
        id={2}
        teamName={teams.team2.name}
        teamScore={teams.team2.score}
        teamWickets={teams.team2.wickets}
        teamBalls={teams.team2.balls}
        setTeamName={(newName) =>
          setTeams({ ...teams, team2: { ...teams.team2, name: newName } })
        }
        setTeamScore={(newScore) =>
          setTeams({ ...teams, team2: { ...teams.team2, name: newScore } })
        }
        setTeamWickets={(newWickets) =>
          setTeams({ ...teams, team2: { ...teams.team2, name: newWickets } })
        }
        setTeamBalls={(newBalls) =>
          setTeams({ ...teams, team2: { ...teams.team2, name: newBalls } })
        }
        handleTeamName={onSubmitTeam2Name}
        handleTeamScore={(runs) => handleTeamScore(2, runs)}
        handleTeamWickets={(wickets) => handleTeamWickets(2, wickets)}
        handleTeamBalls={(balls) => handleTeamBalls(2, balls)}
        logoUpload={logoUpload}
        setLogoUpload={setLogoUpload}
        uploadLogo={uploadLogo}
      />
    </div>
  );
}

export default App;
