import {Address} from "src/scripts/types.ts";
import Table from "react-bootstrap/Table";
import {Button} from "react-bootstrap";
import {deleteFavorite} from "src/scripts/favorites-requests.ts";
import "src/styles/AddressFavorites.css"

function AddressFavorites({favorites, updateFavoritesCallback, showFavoriteResultCallback}: {
  favorites: Address[]
  updateFavoritesCallback: () => void
  showFavoriteResultCallback: (address: Address) => void
}) {
  const tableRows = favorites.map((favorite, index) =>
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <Button variant="link" onClick={() => showFavoriteResultCallback(favorite)}>
            {favorite.city}
          </Button>
        </td>
        <td>
          <Button variant="link" onClick={() => showFavoriteResultCallback(favorite)}>
            {favorite.state}
          </Button>
        </td>
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