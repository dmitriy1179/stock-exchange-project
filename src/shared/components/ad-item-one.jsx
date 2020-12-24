import React from "react";

const AdItemOne = ({ _id, title, createdAt, price, address, description, owner, onClick, children }) => {
  return (
    <div className="border rounded my-3 mx-auto w-75 p-3">
      <div className="font-weight-bolder text-justify my-3" style={{fontSize:"26px"}}>{title}</div>
      <div className="text-justify my-3" style={{fontSize:"24px"}}>{`${price} грн.`}</div>
      <div className="my-3">
        <div className="text-justify my-2" style={{fontSize:"22px"}}>Description</div>
        <div className="text-justify text-break font-italic" style={{fontSize:"18px"}}>{description}</div>
      </div>
      <div className="text-justify my-3" style={{fontSize:"18px"}}>
        <span>Owner: </span> <span className="font-italic">{owner.nick || owner.login}</span>
      </div>
      <div className="d-flex my-3" style={{fontSize: "18px"}}>
        <div>
          Addresses: 
        </div>
        <div className="font-italic ml-2">
          {address || (owner.addresses === null ? null :
            (owner.addresses.length === 0 ? null :
              owner.addresses.map((address, index) => (
                index === 0 ? <span key={index} className="text-justify text-wrap">{address}</span>
                : <span key={index} className="text-justify text-wrap">; {address}</span>
              ))
            )
          )}
        </div>
      </div>
      <div className="d-flex my-3" style={{fontSize: "18px"}}>
        <div>
          Phones:
        </div>
        <div className="font-italic">
          {owner.phones === null ? null :
            (owner.phones.length === 0 ? null :
              owner.phones.map((phone, index) => (
                index === 0 ? <span key={index} className="ml-2 text-wrap">{phone}</span>
                : <span key={index} className="text-wrap">, {phone}</span>
              ))
            )
          }
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="align-self-start mt-3" style={{fontSize:"14px"}}>Posted: {new Date(createdAt/1).toLocaleDateString()}</div>
        <div className="d-flex justify-content-end flex-grow-1 align-items-end">
          <button type="button"
            className="btn btn-outline-secondary mr-3"
            onClick = {onClick}
          >
            Comments
          </button>
          {children}
        </div>
      </div>  
    </div>
  )  
}

export default AdItemOne