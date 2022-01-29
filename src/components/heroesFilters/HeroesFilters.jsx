import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
} from "../../actions";
import { useHttp } from "../../hooks/http.hook";
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const HeroesFilters = () => {
  const dispatch = useDispatch();
  const { request } = useHttp();
  const [activeBtn, setActiveBtn] = useState("all");

  const onClickBtn = (e) => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
      .then((data) =>
        dispatch(
          heroesFetched(
            data.filter((item) => {
              if (e.target.name === "all") {
                return item;
              }
              return item.element === e.target.name;
            })
          )
        )
      )
      .catch(() => dispatch(heroesFetchingError()));
    setActiveBtn(e.target.name);
  };

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">
          <button
            name="all"
            className={`btn btn-outline-dark ${
              activeBtn === "all" ? "active" : ""
            }`}
            onClick={(e) => onClickBtn(e)}
          >
            Все
          </button>
          <button
            name="fire"
            className={`btn btn-danger ${activeBtn === "fire" ? "active" : ""}`}
            onClick={(e) => onClickBtn(e)}
          >
            Огонь
          </button>
          <button
            name="water"
            className={`btn btn-primary ${
              activeBtn === "water" ? "active" : ""
            }`}
            onClick={(e) => onClickBtn(e)}
          >
            Вода
          </button>
          <button
            name="wind"
            className={`btn btn-success ${
              activeBtn === "wind" ? "active" : ""
            }`}
            onClick={(e) => onClickBtn(e)}
          >
            Ветер
          </button>
          <button
            name="earth"
            className={`btn btn-secondary ${
              activeBtn === "earth" ? "active" : ""
            }`}
            onClick={(e) => onClickBtn(e)}
          >
            Земля
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroesFilters;
