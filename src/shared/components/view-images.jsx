import React from "react";

const ViewImages = ({ images }) => {
  const [count, setCount] = React.useState(0);
  const onClickNext = () => {
    setCount((prev) => prev + 1)
  }
  const onClickPrev = () => {
    setCount((prev) => prev - 1)
  }
  return (
    <div className="border rounded my-3 w-75 mx-auto p-3">
      <div className="w-100" style={{height:"750px"}}>
        <img src={`http://marketplace.asmer.fs.a-level.com.ua/${images[count].url}`}
          className="img-fluid rounded w-100 h-100"
          alt="picture" 
        />
      </div>
      <div className="d-flex justify-content-between">
        <button type="button"
          className="btn btn-outline-secondary btn-sm m-3"
          disabled={count === 0}
          style={{width:"70px"}}
          onClick = {onClickPrev}
        >
          Prev
        </button>
        <button type="button"
          className="btn btn-outline-secondary btn-sm m-3"
          disabled={count === images.length-1}
          style={{width:"70px"}}
          onClick = {onClickNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ViewImages