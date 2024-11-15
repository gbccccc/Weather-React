import {Address} from "src/scripts/types.ts";
import Table from "react-bootstrap/Table";
import {Button} from "react-bootstrap";
import {deleteFavorite} from "src/scripts/favorites-requests.ts";
import "src/styles/AddressFavorites.css"

function AddressFavorites({favorites, updateFavoritesCallback}: {
  favorites: Address[]
  updateFavoritesCallback: () => void
}) {
  const tableRows = favorites.map((favorite, index) =>
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{favorite.city}</td>
        <td>{favorite.state}</td>
        <td>
          <Button variant="outline-secondary" className="delete-favorite-button"
                  onClick={() => onClickDeletion(favorite)}/>
        </td>
      </tr>
  )

  function onClickDeletion(favorite: Address) {
    deleteFavorite(favorite).then(updateFavoritesCallback)
  }

  return (
      <div>
        <Table bordered={false} className="mt-3">
          <thead>
          <tr>
            <th>#</th>
            <th>City</th>
            <th>State</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {tableRows}
          </tbody>
        </Table></div>
  )
}

export default AddressFavorites;