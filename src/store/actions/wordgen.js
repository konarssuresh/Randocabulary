import * as actionTypes from "./actionTypes";

export const fetchWordsSuccess = (fechedWords) => {
  return {
    type: actionTypes.FETCH_WORDS_SUCCESS,
    payload: fechedWords,
  };
};

export const fetchWordsFail = (error) => {
  return {
    type: actionTypes.FETCH_MEANING_FAILURE,
    payload: error,
  };
};

export const fetchWords = (count) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.FETCH_WORDS_INIT });
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?number=${count}`
      );
      const result = await response.json();
      dispatch(fetchWordsSuccess(result));
    } catch (err) {
      dispatch(fetchWordsFail(err));
    }
  };
};

export const fetchMeaningSuccess = (fetchedMeaning) => {
  return {
    type: actionTypes.FETCH_MEANING_SUCCESS,
    payload: fetchedMeaning,
  };
};

export const fetchMeaningFailure = (error) => {
  return {
    type: actionTypes.FETCH_MEANING_FAILURE,
    payload: error,
  };
};

export const fetchMeaning = (word) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.FETCH_MEANING_INIT });
      const response = await fetch(
        `https://wordsapiv1.p.rapidapi.com/words/${word}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": `${process.env.REACT_APP_HOST}`,
            "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
          },
        }
      );
      const result = await response.json();
      dispatch(fetchMeaningSuccess(result));
    } catch (err) {
      dispatch(fetchMeaningFailure(err));
    }
  };
};
