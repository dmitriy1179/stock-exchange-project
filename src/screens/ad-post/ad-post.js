import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import StatusResolver from "../../shared/components/statusResolver"
import ReactTagInput from "@pathofdev/react-tag-input"
import "@pathofdev/react-tag-input/build/index.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const postAd = gql`
  mutation post($title: String!, $description: String, $images: [ImageInput], $tags: [String], $address: String, $price: Float!) {
    AdUpsert(ad: {
      title: $title,
      description: $description,
      images: $images,
      tags: $tags
      address: $address,
      price: $price
    }) {
      _id
    }
  }
`;

const PostAdUser = ({ dispatch, arrImages, status }) => {
  const [values, setValues] = React.useState({
    "tags": ["sport", "entertainment", "health", "antiques", "technology"],
    "images": []
  });
  const [isDelImage, setIsDelImage] = React.useState(false);

  const onChange = (e) => {
    const target = e.target;
    target.name === "price" ? 
    (setValues((prev) => ({
      ...prev,
      [target.name]: +target.value
    }))) : 
    (setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    })));
    console.log("values", values)
  };

  const onChangeTagsInput = (newTags) => {
    setValues((prev) => ({
      ...prev,
      "tags": [...newTags]
    }));
    console.log("values", values)
  }

  const onClickDelete = (i) => {
    arrImages.splice(i, 1);
    dispatch({ type: "arrImages/formed", payload: arrImages });
    setIsDelImage(!isDelImage)
  }

  const onChangeInputImage = (e) => {
    dispatch({ type: "getArrImages/request", payload: e.target.files });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (arrImages.length !== 0) {
      arrImages.forEach((image) => {
        const {_id: id} = image
        console.log("imageId", {_id:id})
        values.images.push({_id:id})
      })
      console.log("images", values.images)
    }
    try {
      dispatch({ type: "request/pending" });
      API.request(postAd, values)
       .then((res) => {
          console.log("res", res)
          dispatch({ type: "request/resolved" });
        });
    } catch (e) {
      dispatch({ type: "request/rejected" });
    }  
  };

  React.useEffect(() => {
    return () => dispatch({ type: "request/reset" })
  }, [])

  return (
    <div className="mt-3 flex-grow-1">
      <form onSubmit={onSubmit} className="col-8 mx-auto mt-3">
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Title *</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              name="title"
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Description</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              placeholder="Description"
              name="description"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">ImageInput</label>
          <div className="col-sm-10">
            <input
              type="file"
              className="form-control-file"
              placeholder="ImageInput"
              name="imageInput"
              onChange={onChangeInputImage}
              disabled={status === "searching"}
              multiple
            />
          </div>
          <div className="d-flex justify-content-center flex-wrap ml-3">
            {arrImages === null || arrImages.length === 0 ? null : (
              arrImages.map((image, index) => (
                image.url === null ? null :
                  <div key={index} className="mt-3 col-3 w-100 mx-auto px-3">
                    <div className="w-100">
                      <img src={`http://marketplace.asmer.fs.a-level.com.ua/${image.url}`}
                        className="img-fluid rounded w-100 h-100"
                        alt="picture" 
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="button"
                        className="btn btn-outline-danger btn-sm my-3"
                        disabled={status === "searching"}
                        onClick = {() => onClickDelete(index)}
                        >
                        Delete
                      </button>
                    </div>
                  </div>    
                )
              )
            )}
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Tags</label>
          <div className="col-sm-10">
            <ReactTagInput 
              tags={values.tags}
              onChange={(newTags) => onChangeTagsInput(newTags)}
            />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Address</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              name="address"
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Price *</label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              name="price"
              onChange={onChange}
              required
            />
          </div>
        </div>
        <button className="btn btn-secondary" disabled={status === "searching"}>Post ad</button>
      </form>
      <StatusResolver
        status={status}
        >
          <Redirect to="/ad/curUser" />
      </StatusResolver>
    </div>
  );
};

const mapStateToProps = (state) => ({
  arrImages: state.images.arrImages,
  status: state.images.status
});

export default connect(mapStateToProps)(PostAdUser)