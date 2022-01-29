import { useHttp } from "../../hooks/http.hook";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  heroesFetched,
  heroesFetchingError,
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
} from "../../actions";
import Spinner from "../spinner/Spinner";

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const HeroesAddForm = () => {
  const { heroes, heroesLoadingStatus } = useSelector((state) => state);
  const { filters, filtersLoadingStatus } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { request } = useHttp();

  const [nameHero, setNameHero] = useState("");
  const [descHero, setDescHero] = useState("");
  const [propHero, setPropHero] = useState("all");

  useEffect(() => {
    dispatch(filtersFetching());
    request("http://localhost:3001/filters")
      .then((data) => dispatch(filtersFetched(data)))
      .catch(() => dispatch(filtersFetchingError()));
  }, []);

  if (filtersLoadingStatus === "loading") {
    return <Spinner />;
  } else if (filtersLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const createNewHero = () => {
    const newHeros = heroes;
    newHeros.push({
      id: uuidv4(),
      name: nameHero,
      description: descHero,
      element: propHero,
    });
    fetch("http://localhost:3001/heroes/", {
      method: "POST",
      body: JSON.stringify({
        id: uuidv4(),
        name: nameHero,
        description: descHero,
        element: propHero,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((data) => {
        dispatch(heroesFetched(newHeros));
        setNameHero("");
        setDescHero("");
        setPropHero("");
      })
      .catch(() => dispatch(heroesFetchingError()));
  };

  return (
    <form
      className="border p-4 shadow-lg rounded"
      onSubmit={(e) => {
        e.preventDefault();
        createNewHero();
      }}
    >
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4 first second">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          className="form-control"
          id="name"
          value={nameHero}
          placeholder="Как меня зовут?"
          onInput={(e) => setNameHero(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          required
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          value={descHero}
          style={{ height: "130px" }}
          onInput={(e) => setDescHero(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          required
          className="form-select"
          id="element"
          value={propHero}
          name="element"
          onInput={(e) => setPropHero(e.target.value)}
        >
          {filters.map((item) => {
            let name;
            switch (item) {
              case "all":
                name = "Я владею всеми элементами";
                break;
              case "fire":
                name = "Огонь";
                break;
              case "water":
                name = "Вода";
                break;
              case "wind":
                name = "Ветер";
                break;
              case "earth":
                name = "Земля";
                break;
              default:
                name = "Способность";
                break;
            }
            return (
              <option key={item} value={item}>
                {name}
              </option>
            );
          })}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
