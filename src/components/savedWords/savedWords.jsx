import React from "react";
import classes from "./savedWords.module.css";
import { connect } from "react-redux";
import withauth from "../requireAuth";
import { fetchMeaning } from "../../store/actions";
import firebase from "../../firebase";
import {
  Table,
  Modal,
  Button,
  Segment,
  Dimmer,
  Loader,
  Grid,
  Input,
} from "semantic-ui-react";
const SavedWords = (props) => {
  const { uid, onFetchMeaning } = props;
  const [dbWords, setDbWords] = React.useState({});
  const [selectedWord, setSelectedWord] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [filterWord, setFilterWord] = React.useState("");

  const getWordsFromDb = async () => {
    setLoading(true);
    const wordsDb = firebase.database().ref().child(uid);
    await wordsDb.once("value", (snapshot) => {
      const data = snapshot.val();
      setDbWords(data);
    });
    setLoading(false);
  };

  const removeWordsFromDb = async (key) => {
    setLoading(true);
    const wordsDb = firebase.database().ref(`${uid}/${key}`);
    await wordsDb.remove();
    setLoading(false);
  };

  React.useEffect(() => {
    if (selectedWord) {
      onFetchMeaning(selectedWord);
    }
  }, [onFetchMeaning, selectedWord]);

  React.useEffect(() => {
    const fetchData = async () => {
      await getWordsFromDb();
    };
    if (uid) {
      fetchData();
    }
  }, [uid]);
  let modalData;
  if (props.dict) {
    modalData = (
      <React.Fragment>
        <Modal.Header>{props.dict.word}</Modal.Header>

        {props.fetchingMeaning ? (
          <Dimmer active={props.fetchingMeaning} inverted>
            {props.fetchMeaning ? <Loader inverted>Loading...</Loader> : null}
          </Dimmer>
        ) : null}
        {props.dict.success === false ? (
          <p>word not found in dictionary</p>
        ) : (
          props.dict.results?.map((result, index) => {
            return (
              <Segment key={index}>
                <h4>{index + 1}</h4>
                <p>
                  <strong>Defination :-</strong>
                  {result.definition}
                </p>
                <p>
                  <strong>part of speech :-</strong>
                  {result.partOfSpeech}
                </p>
                <p>
                  <strong>Synonyms:-</strong>
                  {result.synonyms?.join(",")}
                </p>
              </Segment>
            );
          })
        )}
        {props.dict.results ? null : (
          <p>Meaning of that word not found in our dictionary... sorry</p>
        )}
      </React.Fragment>
    );
  }
  let tableData;

  tableData = Object.keys(dbWords).map((key) => {
    if (
      dbWords[key] !== "random" &&
      dbWords[key].toLowerCase().includes(filterWord.toLowerCase())
    ) {
      return (
        <Table.Row key={key}>
          <Table.Cell>{dbWords[key]}</Table.Cell>
          <Table.Cell>
            <Modal
              closeIcon
              onClose={() => setSelectedWord("")}
              onOpen={() => setSelectedWord(dbWords[key])}
              trigger={
                <Button basic color="blue">
                  Get Meaning
                </Button>
              }
            >
              {" "}
              {modalData}
            </Modal>
            <Button
              color="red"
              onClick={async () => {
                await removeWordsFromDb(key);
                await getWordsFromDb();
              }}
            >
              Remove
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    } else {
      return null;
    }
  });

  const tableTemplate = (
    <Table>
      <Table.Body>{tableData}</Table.Body>
    </Table>
  );

  return (
    <div className={classes.SavedWords}>
      <Segment raised>
        <Dimmer active={loading} inverted>
          <Loader inverted>Please wait...</Loader>
        </Dimmer>
        <Grid>
          <Grid.Row>
            <h3> Saved Words</h3>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Input
                type="text"
                placeholder="search saved words"
                fluid
                value={filterWord}
                onChange={(v) => setFilterWord(v.target.value)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <div className={classes.tableContainer}>{tableTemplate}</div>
          </Grid.Row>
          <Grid.Row>
            {tableData.length === 1 && !filterWord ? (
              <h4>No stored data in database</h4>
            ) : null}
            {tableData.length === 0 && filterWord.length > 0 ? (
              <h4>No words found...</h4>
            ) : null}
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    randomWords: state.wordgen.randomWords,
    dict: state.wordgen.meaning,
    fetchingMeaning: state.wordgen.fetchingMeaning,
    fetchingWords: state.wordgen.fetchingWords,
    auth: state.firebase.auth,
    uid: state.firebase.auth.uid,
  };
};

const mapDispatchedToProps = (dispatch) => {
  return {
    onFetchMeaning: (word) => dispatch(fetchMeaning(word)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchedToProps
)(withauth(SavedWords));
