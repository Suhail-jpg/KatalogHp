// ======================= FUNGSI MENU HAMBURGER =======================
const hamburger = document.querySelector(".ri-menu-3-line");
const menu = document.querySelector(".menu");

// Toggle Menu saat Hamburger diklik
hamburger.addEventListener("click", () => {
    menu.classList.toggle("menu-aktif");
});

// Sembunyikan Menu saat Scroll di perangkat Mobile
window.onscroll = () => {
    menu.classList.remove("menu-aktif");
};

// ======================= DATA PRODUK DETAIL =======================
const productsData = [
    { id: 'm16', name: 'Samsung Galaxy M16', price: 3999000, specs: ['Layar: FHD+ AMOLED 120Hz', 'Chipset: Exynos 1480', 'Baterai: 6000 mAh Super Fast Charging', 'Kamera: 64MP OIS', 'RAM/Storage: 8GB/128GB'] },
    { id: 'a175g', name: 'Samsung Galaxy A17 5G', price: 2199000, specs: ['Layar: 6.5" 90Hz LCD', 'Chipset: Dimensity 700', 'Baterai: 5000 mAh', 'Kamera: 50MP', 'RAM/Storage: 4GB/64GB'] },
    { id: 'a36', name: 'Samsung Galaxy A36', price: 4599000, specs: ['Layar: Super AMOLED 120Hz', 'Chipset: Snapdragon 7 Gen 1', 'Baterai: 5000 mAh', 'Kamera: 64MP OIS', 'RAM/Storage: 8GB/256GB'] },
    { id: 'a56', name: 'Samsung Galaxy A56', price: 6799000, specs: ['Layar: 120Hz Dynamic AMOLED', 'Chipset: Exynos 2300', 'Baterai: 5000 mAh', 'Kamera: 108MP Pro', 'RAM/Storage: 12GB/512GB'] },
    { id: 's25plus', name: 'Samsung Galaxy S25 Plus', price: 15499000, specs: ['Layar: Dynamic LTPO AMOLED', 'Chipset: Snapdragon 8 Gen 4', 'Baterai: 4900 mAh', 'Kamera: 50MP Pro-Grade', 'Fitur: AI Enhanced'] },
    { id: 's25ultra', name: 'Samsung Galaxy S25 Ultra', price: 21999000, specs: ['Layar: 6.9" Dynamic AMOLED', 'Chipset: Snapdragon 8 Gen 4 (Custom)', 'Baterai: 5000 mAh', 'Kamera: 200MP Zoom 10x Optical', 'Fitur: S Pen Pro'] },
    { id: 's26', name: 'Samsung Galaxy S26', price: 12999000, specs: ['Layar: Dynamic AMOLED', 'Chipset: Exynos 2500', 'Baterai: 4000 mAh', 'Kamera: 50MP', 'RAM/Storage: 8GB/256GB'] },
    { id: 'zflip7', name: 'Samsung Galaxy Z Flip 7', price: 14500000, specs: ['Layar: Foldable Dynamic AMOLED', 'Chipset: Snapdragon 8 Gen 4', 'Baterai: 3800 mAh', 'Kamera: 12MP Dual', 'Desain: Compact Flip'] },
    { id: 'zfold7', name: 'Samsung Galaxy Z Fold 7', price: 26999000, specs: ['Layar: Foldable 7.6" Dynamic AMOLED', 'Chipset: Snapdragon 8 Gen 4', 'Baterai: 4400 mAh', 'Kamera: 50MP Under Display', 'Fitur: Multi-Tasking S Pen'] }
];

// ======================= ELEMEN DOM =======================
const productItems = document.querySelectorAll(".product-list .product-item");
const btnFilter = document.querySelectorAll(".product-box li");
const modalProductDetail = document.getElementById("product-modal");
const modalCart = document.getElementById("cart-modal");
const modalCheckout = document.getElementById("checkout-modal");
const modalBodyContent = document.getElementById("modal-body-content");
const cartIcon = document.querySelector(".cart-icon");
const cartItemsContainer = document.getElementById("cart-items");
const cartSelectedQty = document.getElementById("cart-selected-qty");
const cartSelectedTotal = document.getElementById("cart-selected-total");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutForm = document.getElementById("checkout-form");
const checkoutQty = document.getElementById("checkout-qty");
const checkoutTotal = document.getElementById("checkout-total");
const allCloseButtons = document.querySelectorAll(".close-btn");

// ======================= STATE KERANJANG =======================
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// Helper untuk format harga ke Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// ======================= FUNGSI MODAL UTAMA =======================

// Fungsi untuk menutup modal
const closeModal = (modalElement) => {
    if (modalElement) {
        modalElement.style.display = "none";
    }
};

// Fungsi untuk membuka modal
const openModal = (modalElement) => {
    if (modalElement) {
        modalElement.style.display = "block";
    }
};

// Listener untuk semua tombol tutup (tombol silang)
allCloseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const modalId = e.target.getAttribute('data-modal-id');
        if (modalId) {
            closeModal(document.getElementById(modalId));
        }
    });
});

// Listener untuk menutup modal saat klik di luar area
window.onclick = (event) => {
    if (event.target == modalProductDetail) {
        closeModal(modalProductDetail);
    } else if (event.target == modalCart) {
        closeModal(modalCart);
    } else if (event.target == modalCheckout) {
        closeModal(modalCheckout);
    }
}


// ======================= KERANJANG & CHECKOUT LOGIC =======================

const saveCart = () => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCart();
}

const calculateSelectedTotal = () => {
    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        if (item.selected) {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;
        }
    });

    cartSelectedQty.textContent = totalQty;
    cartSelectedTotal.textContent = formatRupiah(totalPrice);

    return { totalQty, totalPrice };
}

const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Keranjang Anda kosong.</p>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            const formattedPrice = formatRupiah(item.price);

            itemElement.innerHTML = `
                <input type="checkbox" data-index="${index}" ${item.selected ? 'checked' : ''} class="item-checkbox">
                <div class="item-info">
                    <strong>${item.name}</strong>
                    <span>${formattedPrice} x ${item.qty}</span>
                </div>
                <div class="item-actions">
                    <button class="btn-pesan" style="background-color: #f44336;" data-index="${index}">Hapus</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Pasang listener untuk checkbox dan tombol hapus
        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart[index].selected = e.target.checked;
                saveCart(); 
            });
        });

        document.querySelectorAll('.item-actions button').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                removeItemFromCart(indexToRemove);
            });
        });

        const { totalQty } = calculateSelectedTotal();
        checkoutBtn.disabled = totalQty === 0;
    }
}

const addToCart = (product) => {
    // Cek apakah produk sudah ada
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            selected: true // Set item baru otomatis terpilih
        });
    }

    saveCart();
    alert(`"${product.name}" telah ditambahkan ke keranjang.`);
    openModal(modalCart); 
}

const removeItemFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
}

// Handler Tombol Checkout
checkoutBtn.addEventListener('click', () => {
    const selectedItems = cart.filter(item => item.selected);

    if (selectedItems.length === 0) {
        alert("Pilih minimal satu barang untuk melanjutkan Checkout.");
        return;
    }
    
    const { totalQty, totalPrice } = calculateSelectedTotal();

    // Isi ringkasan checkout
    checkoutQty.textContent = totalQty;
    checkoutTotal.textContent = formatRupiah(totalPrice);

    // Tutup modal keranjang dan buka modal checkout
    closeModal(modalCart);
    openModal(modalCheckout);
});

// Handler Konfirmasi Pesanan
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const alamat = document.getElementById('alamat').value;
    const { totalQty, totalPrice } = calculateSelectedTotal();
    
    const confirmationMessage = `
        Terima kasih, ${nama}!
        
        Pesanan Anda (${totalQty} item) senilai ${formatRupiah(totalPrice)} telah kami terima.
        
        Barang akan dikirim ke alamat:
        ${alamat}
        
        Kami akan segera menghubungi Anda.
    `;
    
    alert(confirmationMessage.trim());

    // Hapus barang yang telah dicekout dari keranjang
    cart = cart.filter(item => !item.selected);
    saveCart(); 

    // Tutup modal checkout
    closeModal(modalCheckout);
    document.getElementById('nama').value = '';
    document.getElementById('alamat').value = '';
});


// ======================= MODAL DETAIL PRODUK LOGIC =======================

const openProductDetailModal = (product) => {
    const formattedPrice = formatRupiah(product.price);
    const specsHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');
    const imagePath = `./assets/hp/${product.id}.webp`; 

    // MENGHAPUS TOMBOL SILANG DARI SINI (Karena sudah ada di HTML)
    modalBodyContent.innerHTML = `
        <div>
            <img src="${imagePath}" alt="${product.name}" onerror="this.onerror=null; this.src='./assets/hp/${product.id}.png';" >
            <div class="modal-specs">
                <h2>${product.name}</h2>
                <p><strong>Harga: ${formattedPrice}</strong></p>
                <p>Detail Spesifikasi:</p>
                <ul>${specsHTML}</ul>
                <button class="btn-pesan" id="add-to-cart-btn" data-id="${product.id}">Pesan Sekarang</button>
            </div>
        </div>
    `;
    
    // Attach Pesan button event
    document.getElementById("add-to-cart-btn").addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        const selectedProduct = productsData.find(p => p.id === productId);
        if (selectedProduct) {
            addToCart(selectedProduct);
        }
        closeModal(modalProductDetail); 
    });

    openModal(modalProductDetail);
}

// Event Listeners for Product Click (Open Modal Detail)
productItems.forEach(item => {
    item.addEventListener('click', () => {
        const productId = item.getAttribute('data-id');
        const selectedProduct = productsData.find(p => p.id === productId);
        if (selectedProduct) {
            openProductDetailModal(selectedProduct);
        }
    });
});

// Event Listener untuk Ikon Keranjang (Buka Modal Keranjang)
cartIcon.addEventListener('click', () => {
    renderCart(); // Render ulang keranjang setiap kali dibuka
    openModal(modalCart);
});


// ======================= FUNGSI FILTER PRODUK =======================
btnFilter.forEach(data => {
    data.onclick = () => {
        btnFilter.forEach(reset => {
            reset.className = "";
        });

        data.className = "aktif";
        const btnText = data.textContent.toLowerCase().trim();

        productItems.forEach(item => {
            item.style.display = "none";
            const itemFilter = item.getAttribute("data-filter");

            if (itemFilter && (itemFilter.toLowerCase() === btnText || btnText === "all product")) {
                item.style.display = "block";
            }
        });
    };
});


// Initial Load: Render cart saat halaman dimuat
renderCart();