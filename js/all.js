//初始化
let productList;
let priceData;
let cartsData;

function init() {
  getProductList();
  getCartList();
}
init(); //hoisting 放最下方也可以

// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productList = response.data.products;
      renderList();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

//篩選類別

$(".productSelect").on("change", (e) => {
  console.log(e.target.value);
  renderList(e.target.value);
});

function renderList(option) {
  const newData = productList.filter((item) => {
    if (option === item.category) {
      return item;
      //全部
    }
    if (!option) {
      return item;
    }
  });

  let str = "";
  newData.forEach((item) => {
    str += ` <li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt=""
    />
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$ ${item.origin_price.toLocaleString()}</del>
    <p class="nowPrice">NT$ ${item.price.toLocaleString()}</p>
  </li>`;
  });
  $(".productWrap").html(str);
}

// 取得購物車列表
function getCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      cartsData = response.data.carts;
      priceData = response.data;
      renderCartList();
      renderPriceData();
      // $(".total-price").text(response.data.finalTotal);
      // console.log(cartsData);
      // console.log(response.data);
      // console.log(priceData.total);
      // console.log(priceData);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function renderCartList() {
  let str = "";
  cartsData.forEach((item) => {
    str += `
    <tr>
    <td>
      <div class="cardItem-title">
        <img src="${item.product.images}" alt="" />
        <p>${item.product.title}</p>
      </div>
    </td>
    <td>NT$ ${item.product.price.toLocaleString()}</td>
    <td>${item.quantity}</td>
    <td>NT$ ${(item.product.price * item.quantity).toLocaleString()}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-cartId="${item.id}"> clear </a>
    </td>
    </tr>

`;
  });
  $(".cartItem-info").html(str);
}

//總金額
//另一種做法看第77行
function renderPriceData() {
  let str = ` <tr>
  <td>
    <a href="#" class="discardAllBtn">刪除所有品項</a>
  </td>
  <td></td>
  <td></td>
  <td>
    <p>總金額</p>
  </td>
  <td>NT$ ${priceData.finalTotal.toLocaleString()}</td>
  <tr>`;

  $(".btnAndPrice").html(str);
}

// 加入購物車 寫法一
//外層綁監聽，如果綁在按鈕上，當今天按鈕一多，要去偵測每個按鈕是否有綁監聽，效能會變差
$(".productWrap").on("click", (e) => {
  e.preventDefault();
  //判斷點擊到的是否為「加入購物車」按鈕
  if (e.target.getAttribute("class") !== "addCardBtn") {
    return;
  }
  //如果點擊到的是「加入購物車」按鈕，取得該按鈕的data-id，傳入addCartItem函示中
  let id = e.target.getAttribute("data-id");
  console.log(id);
  addCartItem(id);
});

function addCartItem(id) {
  //購物車中沒有該產品：預設數量1，有該產品，數量+=1
  let num = 1;
  cartsData.forEach((item) => {
    if (item.product.id === id) {
      num = item.quantity += 1;
    }
  });
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: id,
          quantity: num,
        },
      }
    )
    .then(function (response) {
      //重新渲染購物車列表
      getCartList();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

// 加入購物車 寫法二

// $(".productWrap").on("click", (e) => {
//   e.preventDefault();
//   console.log(e.target.getAttribute("data-id"));

//   if (e.target.getAttribute("class") !== "addCardBtn") {
//     return;
//   }

//   let id = e.target.getAttribute("data-id");
//   console.log(e.target.getAttribute("data-id"));

//
//   let num = 1;
//   cartsData.forEach((item) => {
//     if (item.product.id === id) {
//       num = item.quantity += 1;
//       console.log(num);
//     }
//   });
//   console.log(num);

//   axios
//     .post(
//       `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
//       {
//         data: {
//           productId: id,
//           quantity: num,
//         },
//       }
//     )
//     .then(function (response) {
//       console.log(response.data);
//       getCartList();
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
//     .then(function () {
//       // always executed
//     });
// });

// 清除購物車內全部產品;

// 按鈕綁監聽
// 執行deleteAllCartList()

$(".btnAndPrice").on("click", (e) => {
  e.preventDefault();

  if (e.target.getAttribute("class") !== "discardAllBtn") {
    return;
  }

  console.log(e.target);
  deleteAllCartList();
});

function deleteAllCartList() {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      console.log(response.data);
      getCartList();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

// 刪除購物車內特定產品

// 綁監聽
// 點擊的是哪一個cartid
// id傳到deleteCartItem中

$(".cartItem-info").on("click", (e) => {
  e.preventDefault();
  if (e.target.getAttribute("class") !== "material-icons") {
    return;
  }
  let cartId = e.target.getAttribute("data-cartId");
  console.log(cartId);
  deleteCartItem(cartId);
});

function deleteCartItem(cartId) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      console.log(response.data);
      //重新渲染購物車列表
      getCartList();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

//表單驗證 validate.js

const form = document.querySelector(".orderInfo-form");
const inputs = document.querySelectorAll(
  "input[type=text],input[type=email],input[type=tel],select[id=tradeWay]"
);
console.log(inputs);

let constraints = {
  姓名: {
    presence: {
      message: "必填",
    },
  },
  電話: {
    presence: {
      message: "必填",
    },
    length: {
      minimum: 10,
      message: "手機號碼格式不正確",
    },
  },
  Email: {
    presence: {
      message: "必填",
    },
    email: {
      message: "Email格式不正確",
    },
  },
  寄送地址: {
    presence: {
      message: "必填",
    },
  },
  交易方式: {
    presence: {
      message: "必填",
    },
  },
};

inputs.forEach((item) => {
  item.addEventListener("change", (e) => {
    e.preventDefault();
    item.nextElementSibling.textContent = "";
    let errors = validate(form, constraints) || "";
    console.log(errors);

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        console.log(document.querySelector(`[data-message=${keys}]`));
        document.querySelector(`[data-message="${keys}"]`).textContent =
          errors[keys];
      });
    }
  });
});

//表單驗證 判斷必填
// console.log(inputs);
// const inputArr = Array.from(inputs);
// inputArr.forEach((item) => {
//   item.addEventListener("blur", (e) => {
//     if (item.value === "") {
//       item.nextElementSibling.textContent = "必填";
//     } else {
//       item.nextElementSibling.textContent = "";
//     }
//   });
// });

// // 送出購買訂單
//購物車要有東西，且預定資料填寫完整才可送出

$(".orderInfo-btn").on("click", (e) => {
  e.preventDefault();

  if (cartsData.length === 0) {
    alert("目前購物車中沒有商品，將欲購買的商品加入購物車");
    return;
  }

  if (
    $("#customerName").val() === "" ||
    $("#customerPhone").val() === "" ||
    $("#customerEmail").val() === "" ||
    $("#customerAddress").val() === "" ||
    $("#tradeWay").val() === ""
  ) {
    alert("請填寫完整資料");
  }

  let userData = {
    name: $("#customerName").val(),
    tel: $("#customerPhone").val(),
    email: $("#customerEmail").val(),
    address: $("#customerAddress").val(),
    payment: $("#tradeWay").val(),
  };

  createOrder(userData);

  document.querySelector("#customerName").value = "";
  document.querySelector("#customerPhone").value = "";
  document.querySelector("#customerEmail").value = "";
  document.querySelector("#customerAddress").value = "";
  document.querySelector("#tradeWay").value = "";
});

function createOrder(userData) {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: userData.name,
            tel: userData.tel,
            email: userData.email,
            address: userData.address,
            payment: userData.payment,
          },
        },
      }
    )
    .then(function (response) {
      // console.log(response.data);
      getCartList();
    })
    .catch(function (error) {
      console.log(error.response.data);
    })
    .then(function () {
      // always executed
    });
}
