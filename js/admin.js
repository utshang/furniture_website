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
    <td>${new Date(item.createdAt).getFullYear()}/${new Date(
      item.createdAt
    ).getMonth()}/${new Date(item.createdAt).getDate()}</td>
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
// createError.js:16 Uncaught (in promise) Error: Request failed with status code 400

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
  if (status === false) {
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
    });
}

// C3.js
// LV1：做圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾
// LV2：做圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});
