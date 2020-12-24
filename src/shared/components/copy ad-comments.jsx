import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"

const adComments = gql`
  query adComments ($query: String) {
    AdFindOne(query: $query) {
      _id
      comments {
        _id
        owner {
          login
          nick
          _id
        }
        text
        answerTo {
          _id
        }
        createdAt
      }    
    }
  }
`;

const addNewComment = gql`
  mutation addNewComment($text: String! $ad: AdInput!) {
    CommentUpsert(comment: {
      text: $text,
      ad: $ad,
    }) {
      _id
    }
  }
`;

const commentFind = gql`
  query CommentFind($query: String) {
    CommentFindOne(query: $query) {
      _id
      answerTo {
        _id
        ad {
          _id
        }
      }
      answers {
        _id
        text
        createdAt
        owner {
          login
          nick
          _id
        }
        ad {
          _id
        }
        answerTo {
          _id
          ad {
            _id
          }
        }
      }
    }
  }
`;

const addNewAnswer = gql`
  mutation addNewAnswer($text: String! $answerTo: CommentInput!) {
    CommentUpsert(comment: {
      text: $text,
      answerTo: $answerTo,
    }) {
      _id
    }
  }
`;

const Answers = ({ id }) => {
  const [comment, setComment] = React.useState(null)
  const [status, setStatus] = React.useState("idle");
  const [viewAnswer, setViewAnswer] = React.useState(false)

  const findComment = (id) => {
    try {
      setStatus("searching")
      API.request(commentFind, {
        query: JSON.stringify([
          {
            _id: id
          }
        ])
      }).then((res) => {
        console.log("res", res)
        setComment(res.CommentFindOne);
        /*setAnswersId(res.CommentFindOne.answers === null ? null :
          res.CommentFindOne.answers.filter((answer) => answer.answerTo._id === id).map((answer) => 
            answer = {[answer._id]: false})
        )*/
        setStatus("resolved");
      })
    }
    catch(e) {
      setStatus("rejected")
    }
  }

  const viewAnswers = (id) => {
    setViewAnswer(!viewAnswer)
    console.log("answersId", id)
  }
  return (
    <>
    <div className="mt-1 mb-3">
      <div className="d-flex justify-content-end">
        <button type="submit"
          className="btn btn-outline-secondary btn-sm"
          style={{width:"110px"}}
          onClick={() => viewAnswers(id)}
        >
          View answers
        </button>
      </div>
    </div>
    {viewAnswer ? 
      <div>{id}</div>
      : null}
    </>  
  )
}

const AdComments = ({ id }) => {
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const [values, setValues] = React.useState({"ad": {"_id": id}})
  const [isClickAddComment, setIsClickAddComment] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(true)

  const findAdComments = async () => {
    try {
      const res = await API.request(adComments, {
        query: JSON.stringify([
          {
            _id: id
          }
        ])
      })
      if (isMounted) {
        console.log("_id", id)
        console.log("res", res)
        setResult(res.AdFindOne);
        setStatus("resolved");
      }
    } catch (e) {
      setStatus("rejected");
    }  
  };

  const addComment = () => {
    setIsClickAddComment(true)
  }

  const onChangeTextComment = (e) => {
    e.persist()
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value})
    );
    console.log("value", values)
  }

  const sendComment = (e) => {
    e.preventDefault();
    try {
      //setStatus("searching");
      API.request(addNewComment, values)
        .then((res) => {
          console.log("res", res)
          setStatus("resolved");
          setIsClickAddComment(false)
        });
    } catch (e) {
      setStatus("rejected");
    }  
  }

  React.useEffect(() => {
    setStatus("searching");
    findAdComments()
    const intervalId = setInterval(findAdComments, 2000)
    return () => {
      clearInterval(intervalId)
      setIsMounted(false)
    }
  }, [])

  console.log(result, "result", result !== null);

  return (
    <div className="border rounded my-2 mx-auto w-75 p-3">
      <StatusResolver
        status={status}
      >
        {result === null ? null : (
          result.comments === null ? 
            <>
              <div className="text-info">No comments</div>
              {isClickAddComment ? null :
                <div className="d-flex justify-content-end flex-grow-1 align-items-end">
                  <button type="button"
                    className="btn btn-outline-dark mr-3"
                    onClick = {addComment}
                  >
                    Add comment
                  </button>
                </div>
              }
            </> :
            <div className="d-flex flex-column">
              {result.comments.filter((comment) => comment.answerTo === null).map((comment, index) => 
              <div className="border rounded m-1 px-2" key={index}>
                <div className="d-flex my-1" style={{fontSize:"18px"}}>
                  <div>{comment.owner.nick}:</div>
                  <div className="font-italic text-justify mx-3 flex-grow-1">
                    {comment.text}
                  </div>
                  <div style={{fontSize:"14px"}} className="mt-1 ml-3">
                    {new Date(comment.createdAt/1).toLocaleDateString()}
                  </div>
                </div>
                <div>
                    <Answers id={comment._id}/>
                </div>
              </div>)}
              {isClickAddComment ? null :
                <div className="d-flex justify-content-end mt-3 align-items-end">
                  <button type="button"
                    className="btn btn-outline-dark mr-3"
                    onClick = {addComment}
                  >
                    Add comment
                  </button>
                </div>
              }
            </div>
          )
        }
        {isClickAddComment ?
          <form onSubmit={sendComment}>
            <div className="mt-2 form-group">
              <textarea
                className="form-control"
                placeholder="Enter comment"
                name="text"
                onChange={onChangeTextComment}
                required
              />
              <div className="d-flex justify-content-end mt-3">
                <button type="submit"
                  className="btn btn-outline-primary"
                >
                  Send comment
                </button>
              </div>
            </div> 
          </form>
          : null
        }
      </StatusResolver>
    </div>  
  )
}

export default AdComments
