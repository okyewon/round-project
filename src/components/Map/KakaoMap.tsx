import { useLocation } from "react-router";
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
import { ShelterType } from "../../api";

declare global {
  interface Window {
    kakao: any;
  }
}

interface PlaceType {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface LocationState {
  keyword?: string;
  nearby?: boolean;
}

const { kakao } = window;

const KakaoMap = (): JSX.Element => {
  const location = useLocation();
  const state = (location.state as LocationState) ?? {}; // 기본값 설정
  const { keyword = "", nearby = false } = state;
  const [map, setMap] = useState<any>(null);
  const [searchValue, setSearchValue] = useState(keyword);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [infowindow, setInfowindow] = useState<kakao.maps.InfoWindow | null>(
    null,
  );
  const [shelters, setShelters] = useState<ShelterType[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // const shelterInfo = Shelters();

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const mapInstance = new kakao.maps.Map(container, options);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation({ lat, lng });

        const locPosition = new kakao.maps.LatLng(lat, lng);
        mapInstance.setCenter(locPosition);
      });
    } else {
      alert("현재 위치를 찾을 수 없습니다.");
      const defaultPosition = new kakao.maps.LatLng(33.450701, 126.570667);
      mapInstance.setCenter(defaultPosition);
    }
    setMap(mapInstance);

    const infowindowInstance = new kakao.maps.InfoWindow({ zIndex: 1 });
    setInfowindow(infowindowInstance);
  }, []);

  // useEffect(() => {
  //   if (shelterInfo) {
  //     const xmlString = shelterInfo.data;

  //     const parser = new DOMParser();
  //     const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  //     const items = xmlDoc.getElementsByTagName("item");
  //     const newShelters: ShelterType[] = [];
  //     for (let i = 0; i < items.length; i++) {
  //       const item = items[i];
  //       const shelter = {
  //         careNm: item.getElementsByTagName("careNm")[0].textContent,
  //         divisionNm: item.getElementsByTagName("divisionNm")[0].textContent,
  //         saveTrgtAnimal:
  //           item.getElementsByTagName("saveTrgtAnimal")[0]?.textContent || null,
  //         careAddr: item.getElementsByTagName("careAddr")[0].textContent,
  //         lat: item.getElementsByTagName("lat")[0]?.textContent || null,
  //         lng: item.getElementsByTagName("lng")[0]?.textContent || null,
  //         closeDay:
  //           item.getElementsByTagName("closeDay")[0]?.textContent || null,
  //         careTel: item.getElementsByTagName("careTel")[0].textContent,
  //       } as ShelterType;
  //       newShelters.push(shelter);
  //     }

  //     setShelters((prevShelters) => {
  //       if (JSON.stringify(prevShelters) !== JSON.stringify(newShelters)) {
  //         return newShelters;
  //       }
  //       return prevShelters;
  //     });
  //   }
  // }, [shelterInfo]);

  useEffect(() => {
    if (!nearby && !keyword) {
      return;
    }
    if (nearby) {
      searchNearby();
    }
    if (keyword) {
      searchPlaces();
    }
  }, [nearby, keyword]);

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    const R = 6371; // 지구의 반경(km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리(km)
  };

  const searchNearby = () => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const radius = 5; // 반경 5km

      const nearbyShelters = shelters.filter((shelter) => {
        if (shelter.lat && shelter.lng) {
          const distance = calculateDistance(
            lat,
            lng,
            parseFloat(shelter.lat),
            parseFloat(shelter.lng),
          );
          return distance <= radius;
        }
        return false;
      });

      displayPlaces(nearbyShelters);
    } else {
      alert("현재 위치를 찾을 수 없습니다.");
    }
  };

  const searchPlaces = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchValue.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    } else {
      const filteredShelters = shelters.filter((shelter) => {
        const shelterAddr = shelter.careAddr.trim();
        shelterAddr.includes(searchValue.trim());
      });
      setShelters(filteredShelters);
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(searchValue, placesSearchCB);
    }
  };

  const placesSearchCB = (
    data: PlaceType[] | ShelterType[],
    status: "OK" | "ZERO_RESULT" | "ERROR",
    pagination: any,
  ) => {
    if (status === kakao.maps.services.Status.OK && shelters) {
      console.log(data);
      displayPlaces(shelters);

      const filteredPagination = {
        ...pagination,
        last: Math.ceil(shelters.length / pagination.perPage),
        gotoPage: (page: number) => {
          const startIdx = (page - 1) * pagination.perPage;
          const endIdx = startIdx + pagination.perPage;
          displayPlaces(shelters.slice(startIdx, endIdx));
          displayPagination({ ...pagination, current: page });
        },
      };

      displayPagination(filteredPagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT || !shelters) {
      alert("검색 결과가 존재하지 않습니다.");
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const displayPlaces = (places: PlaceType[] | ShelterType[]) => {
    const listEl = document.getElementById("placesList");
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers: kakao.maps.Marker[] = [];

    removeAllChildNods(listEl);
    removeMarker();

    places.forEach((place: PlaceType | ShelterType, i: number) => {
      let placePosition;
      if ("place_name" in place) {
        placePosition = new kakao.maps.LatLng(place.y, place.x);
      } else if ("careNm" in place) {
        placePosition = new kakao.maps.LatLng(place.lat, place.lng);
      }
      const marker = addMarker(placePosition, i);
      const itemEl = getListItem(i, place);

      bounds.extend(placePosition);

      (function (marker, place) {
        kakao.maps.event.addListener(marker, "click", function () {
          displayInfowindow(marker, place);
        });
        itemEl.onclick = function () {
          displayInfowindow(marker, place);
        };
      })(marker, place);

      newMarkers.push(marker);
      listEl?.appendChild(itemEl);
    });

    map.setBounds(bounds);
    setMarkers(newMarkers);
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

  const getListItem = (index: number, place: PlaceType | ShelterType) => {
    let place_name;
    let place_addr;
    let place_tel;
    if ("place_name" in place) {
      place_name = place.place_name;
      place_addr = place.address_name ?? place.road_address_name;
      place_tel = place.phone;
    } else if ("careNm" in place) {
      place_name = place.careNm;
      place_addr = place.careAddr;
      place_tel = place.careTel;
    }
    const el = document.createElement("li");
    const itemStr = `
      <span class="markerbg marker_${index + 1}"></span>
      <div class="info">
        <h5 class="text-lg font-bold">${place_name}</h5>
        <span>${place_addr}</span>
        <span class="tel">${place_tel}</span>
      </div>
    `;

    el.innerHTML = itemStr;
    el.className = "item";
    return el;
  };

  const displayInfowindow = (
    marker: kakao.maps.Marker,
    place: PlaceType | ShelterType,
  ) => {
    let place_name;
    let place_tel;
    if ("place_name" in place) {
      place_name = place.place_name;
      place_tel = place.phone;
    } else if ("careNm" in place) {
      place_name = place.careNm;
      place_tel = place.careTel;
    }
    if (infowindow) {
      infowindow.setContent(
        `<div style="display:flex;flex-direction:column;gap:5px;padding:5px;z-index:1;">
        <p>${place_name}</p>
        <p>${place_tel}</p>
        </div>`,
      );
      infowindow.open(map, marker);

      // 이벤트 전파 방지
      kakao.maps.event.addListener(
        marker,
        "click",
        function (event: { stopPropagation: () => void }) {
          event.stopPropagation();
        },
      );
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
                placeholder="지역 or 보호소명"
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
