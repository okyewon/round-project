import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  Button,
  Form,
  Input,
  List,
  Pagination,
  SearchWrap,
  Wrapper,
} from "./KakaoMapStyle";

declare global {
  interface Window {
    kakao: any;
  }
}

const { kakao } = window;

const KakaoMap = (): JSX.Element => {
  const [map, setMap] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [infowindow, setInfowindow] = useState<kakao.maps.InfoWindow | null>(
    null,
  );

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const mapInstance = new kakao.maps.Map(container, options);
    setMap(mapInstance);

    const infowindowInstance = new kakao.maps.InfoWindow({ zIndex: 1 });
    setInfowindow(infowindowInstance);
  }, []);

  const searchPlaces = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchValue.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchValue, placesSearchCB);
  };

  const placesSearchCB = (data: any, status: any, pagination: any) => {
    if (status === kakao.maps.services.Status.OK) {
      displayPlaces(data);
      displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
    }
  };

  const displayPlaces = (places: any[]) => {
    const listEl = document.getElementById("placesList");
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers: kakao.maps.Marker[] = [];

    removeAllChildNods(listEl);
    removeMarker();

    places.forEach((place, i) => {
      const placePosition = new kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(placePosition, i);
      const itemEl = getListItem(i, place);

      bounds.extend(placePosition);

      (function (marker, title) {
        kakao.maps.event.addListener(marker, "mouseover", function () {
          displayInfowindow(marker, title);
        });
        kakao.maps.event.addListener(marker, "mouseout", function () {
          if (infowindow) infowindow.close();
        });
        itemEl.onmouseover = function () {
          displayInfowindow(marker, title);
        };
        itemEl.onmouseout = function () {
          if (infowindow) infowindow.close();
        };
      })(marker, place.place_name);

      newMarkers.push(marker);
      listEl?.appendChild(itemEl);
    });

    map.setBounds(bounds);
    setMarkers(newMarkers);
    console.log(newMarkers);
  };

  const addMarker = (position: kakao.maps.LatLng, idx: number) => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions,
    );
    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(map);
    return marker;
  };

  const removeMarker = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const getListItem = (index: number, place: any) => {
    const el = document.createElement("li");
    const itemStr = `
      <span class="markerbg marker_${index + 1}"></span>
      <div class="info">
        <h5>${place.place_name}</h5>
        <span>${place.road_address_name || place.address_name}</span>
        <span class="tel">${place.phone}</span>
      </div>
    `;

    el.innerHTML = itemStr;
    el.className = "item";
    return el;
  };

  const displayInfowindow = (marker: kakao.maps.Marker, title: string) => {
    if (infowindow) {
      infowindow.setContent(
        `<div style="padding:5px;z-index:1;">${title}</div>`,
      );
      infowindow.open(map, marker);
    }
  };

  const displayPagination = (pagination: any) => {
    const paginationEl = document.getElementById("pagination");
    removeAllChildNods(paginationEl);

    for (let i = 1; i <= pagination.last; i++) {
      const el = document.createElement("a");
      el.href = "#";
      el.innerHTML = `${i}`;

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      paginationEl?.appendChild(el);
    }
  };

  const removeAllChildNods = (el: HTMLElement | null) => {
    if (el === null) return;

    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild as ChildNode);
    }
  };

  return (
    <Wrapper>
      <div id="map" className="w-full h-full"></div>
      <SearchWrap id="menu_wrap" className="bg_white">
        <div className="option">
          <div>
            <Form onSubmit={searchPlaces}>
              <Input
                type="text"
                value={searchValue}
                id="keyword"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button type="submit">
                <IoSearch />
              </Button>
            </Form>
          </div>
        </div>
        <List id="placesList"></List>
        <Pagination id="pagination"></Pagination>
      </SearchWrap>
    </Wrapper>
  );
};

export default KakaoMap;
