import React from "react";
import camera from "../../shared/images/camera.png"

const AdItem = ({_id, images, title, createdAt, price, owner, children}) => {
  return (
    <li className="border rounded my-3 mx-auto w-75 p-3 d-flex">
      <div style={{width:"170px", height:"120px"}}>
        {images === null || images.length === 0 ? 
          <img src={camera}
            className="img-fluid rounded w-100 h-100"
            alt="picture" 
            style={{objectFit: "cover"}}
          /> 
        : (
          images[0].url === null ? 
          <img src={camera}
            className="img-fluid rounded w-100 h-100"
            alt="picture" 
            style={{objectFit: "cover"}}
          /> 
          :
          <img src={`http://marketplace.asmer.fs.a-level.com.ua/${images[0].url}`}
            className="img-fluid rounded w-100 h-100"
            alt="picture" 
            style={{objectFit: "cover"}}
          />
          )
        }
      </div>
      <div className="d-flex flex-column flex-grow-1 mx-3">
        <div className="d-flex justify-content-between">
          <div className="font-weight-bolder" style={{fontSize:"22px"}}>{title}</div>
          <div style={{fontSize:"20px"}}>{`${price} грн.`}</div>
        </div>
        <div className="align-self-start" style={{fontSize:"14px"}}>Owner: {owner.nick || owner.login}</div>
        <div className="align-self-start" style={{fontSize:"12px"}}>Posted: {new Date(createdAt/1).toLocaleDateString()}</div>
        <div className="d-flex justify-content-end flex-grow-1 align-items-end">
          {children}
        </div>
      </div>  
    </li>
  )  
}

export default AdItem