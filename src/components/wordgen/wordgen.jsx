import React from "react";
import { connect } from "react-redux";
import { fetchWords, fetchMeaning } from "../../store/actions";
import withauth from "../requireAuth";
import {
  Button,
  Input,
  Grid,
  Segment,
  Table,
  Modal,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import classes from "./wordgen.module.css";
import firebase from "../../firebase";

const storeWord = async (uid, word) => {
  const wordsDb = firebase.database().ref().child(uid);
  let wordPresent = false;

  await wordsDb.once("value", (snapshot) => {
    let values = snapshot.val();
    for (const val in values) {
      if (values[val].toLowerCase() === word.toLowerCase()) {
        wordPresent = true;
      }
    }
  });
  if (!wordPresent) {
    wordsDb.push(word);
  }
};

const Wordgen = (props) => {
  const [count, setCount] = React.useState(5);
  const [typedWord, setTypedWord] = React.useState("");
  const [selectedWord, setSelectedWord] = React.useState("");
  const [storingValue, setStoringValue] = React.useState(false);

  const { onFetchMeaning } = props;
  React.useEffect(() => {
    if (selectedWord) {
      onFetchMeaning(selectedWord);
    }
  }, [onFetchMeaning, selectedWord]);
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
  if (props.randomWords) {
    let data = props.randomWords.map((word, index) => {
      return (
        <Table.Row key={index}>
          <Table.Cell>{word}</Table.Cell>
          <Table.Cell>
            <Modal
              closeIcon
              onClose={() => setSelectedWord("")}
              onOpen={() => setSelectedWord(word)}
              trigger={
                <Button basic color="blue">
                  Get Meaning
                </Button>
              }
            >
              {storingValue ? (
                <Dimmer active={storingValue} inverted>
                  {storingValue ? <Loader inverted>Storing...</Loader> : null}
                </Dimmer>
              ) : null}{" "}
              {modalData}
            </Modal>
            <Button
              basic
              color="green"
              onClick={async () => {
                setStoringValue(true);
                await storeWord(props.auth.uid, word);
                setStoringValue(false);
              }}
            >
              Store
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    });
    tableData = (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{data}</Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
  return (
    <div className={classes.WordGen}>
      {storingValue ? (
        <Dimmer active={storingValue} inverted>
          {storingValue ? <Loader inverted>Storing...</Loader> : null}
        </Dimmer>
      ) : null}
      <Segment raised>
        <Dimmer active={props.fetchingWords} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Grid>
          <Grid.Row>
            <h4>Enter the Number of random words to generate (1-10)</h4>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <Input
                type="number"
                fluid
                placeholder="number of words"
                value={count}
                onChange={(v) => setCount(v.target.value)}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Button
                primary
                disabled={!(count > 0 && count <= 10)}
                onClick={() => {
                  props.onFetchWords(count);
                }}
              >
                Generate
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <h4>Type and search for meaning</h4>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <Input
                type="text"
                fluid
                placeholder="word"
                value={typedWord}
                onChange={(v) => setTypedWord(v.target.value)}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Modal
                closeIcon
                onClose={() => setSelectedWord("")}
                onOpen={() => setSelectedWord(typedWord)}
                trigger={
                  <Button disabled={!typedWord} primary>
                    Get Meaning
                  </Button>
                }
              >
                {storingValue ? (
                  <Dimmer active={storingValue} inverted>
                    {storingValue ? <Loader inverted>Storing...</Loader> : null}
                  </Dimmer>
                ) : null}{" "}
                {modalData}
                {props.dict.results ? (
                  <Button
                    onClick={async () => {
                      setStoringValue(true);
                      await storeWord(props.auth.uid, selectedWord);
                      setStoringValue(false);
                    }}
                    primary
                  >
                    Store
                  </Button>
                ) : null}
              </Modal>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <div className={classes.tableContainer}>{tableData}</div>
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
  };
};

const mapDispatchedToProps = (dispatch) => {
  return {
    onFetchWords: (count) => dispatch(fetchWords(count)),
    onFetchMeaning: (word) => dispatch(fetchMeaning(word)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchedToProps
)(withauth(Wordgen));
