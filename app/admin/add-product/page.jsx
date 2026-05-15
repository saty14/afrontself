"use client";

import { useEffect, useState } from "react";

export default function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    spcategoryid: "",
    sptypeid: "",
    sprovid: "",
    imagelink: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [cookies, setCookies] = useState({ id: null });
  const [imageList, setImageList] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);

  // GET USER ID
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", { cache: "no-store" });
      const data = await res.json();
      setCookies(data);
      setForm((p) => ({ ...p, sprovid: data.id }));
    }
    fetchCookies();
  }, []);

  // FETCH CATEGORY + TYPE
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product-category`)
      .then((res) => res.json())
      .then((data) => setCategories(data.services || []))
      .catch(console.log);

    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product-type`)
      .then((res) => res.json())
      .then((data) => setTypes(data.productType || []))
      .catch(console.log);

    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/image-add`)
      .then((res) => res.json())
      .then((data) => setImageList(data.simages || []))
      .catch(console.log);
  }, []);

  // HANDLE INPUT
  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name, value)
    setForm((p) => ({ ...p, [name]: value }));
  }

  // IMAGE CHANGE
  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("spcategoryid", form.spcategoryid);
      formData.append("sptypeid", form.sptypeid);
      formData.append("sprovid", form.sprovid);
      formData.append("imagelink", form.imagelink);
      // formData.append("sptypename", form.sptypeid);
      // formData.append("spcategoryname", form.spcategoryid);

      const selectedCategory = categories.find(
        (c) => c.spcategoryid === form.spcategoryid
      );

      const selectedType = types.find(
        (t) => t.sptypeid === form.sptypeid
      );

      formData.append(
        "spcategoryname",
        selectedCategory?.name || ""
      );

      formData.append(
        "sptypename",
        selectedType?.name || ""
      );


      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/product/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMsg({ type: "success", text: data.message });

        // RESET
        setForm({
          name: "",
          description: "",
          price: "",
          spcategoryid: "",
          sptypeid: "",
          sprovid: cookies.id,
        });

        setImage(null);
        setPreview(null);

        setTimeout(() => setMsg(null), 3000);
      } else {
        setMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      setLoading(false);
      setMsg({ type: "error", text: err.message });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">

        <h2 className="text-2xl font-bold text-center mb-4">
          Add Product
        </h2>

        {msg && (
          <p
            className={`p-2 mb-3 text-center rounded ${msg.type === "success"
              ? "bg-green-200"
              : "bg-red-200"
              }`}
          >
            {msg.text}
          </p>
        )}

        <form className="grid gap-4" onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          {/* CATEGORY */}
          <select
            name="spcategoryid"
            value={form.spcategoryid}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.spcategoryid}>
                {c.name}
              </option>
            ))}
          </select>

          {/* TYPE */}
          <select
            name="sptypeid"
            value={form.sptypeid}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Type</option>
            {types.map((t) => (
              <option key={t._id} value={t.sptypeid}>
                {t.name}
              </option>
            ))}
          </select>

          {/* IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="border p-2 rounded hidden"
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 object-cover rounded"
            />
          )}

          {/* <input
            name="imagelink"
            placeholder="Image link"
            value={form.imagelink}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          /> */}

          {/* SELECT IMAGE */}
          {/* <div>
            <p className="font-semibold mb-2">Select Product Image</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imageList.map((img) => (
                <div
                  key={img._id}
                  onClick={() => {
                    setForm((p) => ({
                      ...p,
                      imagelink: img.imagelink,
                    }));

                    setPreview(img.imagelink);
                  }}
                  className={`border-2 rounded cursor-pointer overflow-hidden ${form.imagelink === img.imagelink
                      ? "border-blue-600"
                      : "border-gray-300"
                    }`}
                >
                  <img
                    src={img.imagelink}
                    alt="product"
                    className="w-full h-28 object-cover"
                  />

                  <div className="p-1 text-center text-sm">
                    {img.imageCategory}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* IMAGE SELECT BUTTON */}
          <div>
            <p className="font-semibold mb-2">Product Image</p>

            <button
              type="button"
              onClick={() => setOpenImageModal(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Choose Image
            </button>

            {/* Selected Preview */}
            {/* {form.imagelink && (
              <div className="mt-3">
                <img
                  src={form.imagelink}
                  alt="selected"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )} */}
          </div>
          {/* IMAGE MODAL */}
          {openImageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

              <div className="bg-white w-[90%] max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg p-4">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Select Image</h2>

                  <button
                    onClick={() => setOpenImageModal(false)}
                    className="text-red-600 font-bold"
                  >
                    Close ✖
                  </button>
                </div>

                {/* IMAGE GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageList.map((img) => (
                    <div
                      key={img._id}
                      onClick={() => {
                        setForm((p) => ({
                          ...p,
                          imagelink: img.imagelink,
                        }));

                        setPreview(img.imagelink);
                        setOpenImageModal(false); // auto close
                      }}
                      className={`cursor-pointer border rounded overflow-hidden hover:shadow-lg ${form.imagelink === img.imagelink
                          ? "border-blue-600"
                          : "border-gray-300"
                        }`}
                    >
                      <img
                        src={img.imagelink}
                        alt="img"
                        className="w-full h-28 object-cover"
                      />

                      <div className="text-center text-xs p-1">
                        {img.imageCategory || "No Category"}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}