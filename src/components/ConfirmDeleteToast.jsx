import { toast } from "react-toastify";

export const ConfirmDeleteToast = (onConfirm) => {
    toast(
        ({ closeToast }) => (
            <div>
                <p style={{ marginBottom: "10px" }}>
                    Are you sure you want to delete?
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                            onConfirm();
                            closeToast();
                        }}
                    >
                        Yes, Delete
                    </button>

                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={closeToast}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ),
        {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        }
    );
};
