function init() {
  getOrderList();
}
init();

// 取得訂單列表
let orderListData;

function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      console.log(response.data.orders);
      orderListData = response.data.orders;

      renderOrderList();
      renderC3();
    });
}

function renderOrderList() {
  let str = "";
  orderListData.forEach((item) => {
    //訂單品項
    let productStr = "";
    item.products.forEach((productItem) => {
      productStr += `<p>${productItem.title}x${productItem.quantity}</p>`;
    });
    //訂單狀態
    let statusStr = "";
    if (item.paid === false) {
      statusStr = "未處理";
    } else {
      statusStr = "已處理";
    }

    //訂單資訊
    //將 Unix 時間戳轉換為 JavaScript Date 時間戳
    str += ` <tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      ${productStr}
    </td>
    <td>${new Date(item.createdAt * 1000).getFullYear()}/${
      new Date(item.createdAt * 1000).getMonth() + 1
    }/${new Date(item.createdAt * 1000).getDate()}</td>
    <td >
      <a href="#" class="orderStatus" data-orderId="${item.id}" data-status="${
      item.paid
    }" >${statusStr}</a>
    </td>
    <td>
      <input
        type="button"
        class="delSingleOrder-Btn" data-orderId="${item.id}"
        value="刪除"
      />
    </td>
  </tr>`;
  });
  $(".orderList-info").html(str);
}

// // 修改訂單狀態

$(".orderList-info").on("click", (e) => {
  e.preventDefault();
  if (e.target.getAttribute("class") === "orderStatus") {
    let orderId = e.target.getAttribute("data-orderId");
    let status = e.target.getAttribute("data-status");
    editOrderList(orderId, status);
  }
});

function editOrderList(orderId, status) {
  console.log(orderId, status);
  let changeStatus;
  if (status === "false") {
    changeStatus = true;
  } else {
    changeStatus = false;
  }
  console.log(changeStatus);
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: orderId,
          paid: changeStatus,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      alert("狀態更改");

      getOrderList();
    });
}

// 刪除全部訂單

$(".orderPage-list").on("click", (e) => {
  e.preventDefault();
  if (e.target.getAttribute("class") !== "discardAllBtn") {
    return;
  }
  deleteAllOrder();
});

function deleteAllOrder() {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      getOrderList();
      renderC3();
    });
}

// 刪除特定訂單

$(".orderList-info").on("click", (e) => {
  e.preventDefault();
  if (e.target.getAttribute("class") !== "delSingleOrder-Btn") {
    return;
  }
  let orderId = e.target.getAttribute("data-orderId");
  deleteOrderItem(orderId);
});

function deleteOrderItem(orderId) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      getOrderList();
      renderC3();
    });
}

// C3.js
// LV1：做圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾
// 組資料
// let c3Obj = {};
// function renderC3() {
//   orderListData.forEach((item) => {
//     item.products.forEach((item) => {
//       if (c3Obj[item.category] === undefined) {
//         c3Obj[item.category] = item.price * item.quantity;
//       } else {
//         c3Obj[item.category] += item.price * item.quantity;
//       }
//     });
//   });
//   console.log(c3Obj);
//   let c3Arr = [];
//   let c3Keys = Object.keys(c3Obj);
//   console.log(c3Keys);

//   c3Keys.forEach((item) => {
//     c3Arr.push([item, c3Obj[item]]);
//   });
//   console.log(c3Arr);

//   //渲染圖表
//   let chart = c3.generate({
//     bindto: "#chart", // HTML 元素綁定
//     data: {
//       type: "pie",
//       columns: c3Arr,
//       colors: {
//         床架: "#7E7474",
//         收納: "#B2B1B9",
//         窗簾: "#A7BBC7",
//       },
//     },
//   });
// }
// LV2：做圓餅圖，做各產品類別營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」
let c3Obj = {};
function renderC3() {
  orderListData.forEach((item) => {
    item.products.forEach((item) => {
      if (c3Obj[item.title] === undefined) {
        c3Obj[item.title] = item.price * item.quantity;
      } else {
        c3Obj[item.title] += item.price * item.quantity;
      }
    });
  });
  console.log(c3Obj);
  let c3Arr = [];
  let c3Keys = Object.keys(c3Obj);
  console.log(c3Keys);

  c3Keys.forEach((item) => {
    c3Arr.push([item, c3Obj[item]]);
  });
  console.log(c3Arr);

  // ['Antony 床邊桌', 18900]
  //         0          1     陣列跟陣列無法比較，所以要取出陣列的第二筆資料（也就是各產品類別的總金額）去從大到小排序
  c3Arr.sort(function (a, b) {
    return b[1] - a[1];
  });
  console.log(c3Arr);

  //超過四筆，做以下判斷，低於四筆則直接跑下方圖表
  if (c3Arr.length > 3) {
    let other = 0;
    c3Arr.forEach((item, index) => {
      if (index > 2) {
        other += c3Arr[index][1];
      }
    });
    c3Arr.splice(3, c3Arr.length - 1);
    c3Arr.push(["其他", other]);
  }

  //渲染圖表
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: c3Arr,
      colors: {
        c3Arr: "#7E7474",
        收納: "#B2B1B9",
        窗簾: "#A7BBC7",
      },
    },
  });
}
