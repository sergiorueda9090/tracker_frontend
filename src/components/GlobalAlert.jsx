import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { clearAlert } from "../store/globalStore/globalStore";

export default function GlobalAlert() {
  const { alert } = useSelector((state) => state.globalStore);
  const dispatch = useDispatch();

  useEffect(() => {
    if (alert) {
      const {
        type = "info",
        title = "Mensaje",
        text = "",
        html = "",
        confirmText = "Aceptar",
        cancelText = "Cancelar",
        showCancel = false,
        action = null,
        cancelAction = null,
      } = alert;

      // Colores profesionales según el tipo de alerta
      const colorConfig = {
        success: {
          confirmButton: "#10b981", // Verde ecommerce moderno
          iconColor: "#10b981",
        },
        error: {
          confirmButton: "#ef4444", // Rojo profesional
          iconColor: "#ef4444",
        },
        warning: {
          confirmButton: "#f59e0b", // Naranja advertencia
          iconColor: "#f59e0b",
        },
        info: {
          confirmButton: "#3b82f6", // Azul información
          iconColor: "#3b82f6",
        },
        question: {
          confirmButton: "#8b5cf6", // Púrpura pregunta
          iconColor: "#8b5cf6",
        },
      };

      const colors = colorConfig[type] || colorConfig.info;

      Swal.fire({
        title,
        html: html || text,
        icon: type,
        showCancelButton: showCancel,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: colors.confirmButton,
        cancelButtonColor: "#6b7280", // Gris profesional para cancelar
        iconColor: colors.iconColor,
        background: "#ffffff",
        color: "#1f2937", // Texto oscuro profesional
        
        // Estilos personalizados para un look más profesional
        customClass: {
          popup: "swal-ecommerce-popup",
          title: "swal-ecommerce-title",
          htmlContainer: "swal-ecommerce-text",
          confirmButton: "swal-ecommerce-confirm",
          cancelButton: "swal-ecommerce-cancel",
        },

        // Animaciones suaves
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },

        // Asegura que el modal esté encima de cualquier otro elemento
        didOpen: () => {
          const swalContainer = Swal.getPopup().parentElement;
          swalContainer.style.zIndex = "9999";
          
          // Inyectar estilos CSS personalizados
          if (!document.getElementById("swal-custom-styles")) {
            const style = document.createElement("style");
            style.id = "swal-custom-styles";
            style.innerHTML = `
              .swal-ecommerce-popup {
                border-radius: 16px !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                            0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                padding: 2rem !important;
              }
              
              .swal-ecommerce-title {
                font-size: 1.5rem !important;
                font-weight: 600 !important;
                color: #111827 !important;
                margin-bottom: 0.5rem !important;
              }
              
              .swal-ecommerce-text {
                font-size: 1rem !important;
                color: #4b5563 !important;
                line-height: 1.5 !important;
              }
              
              .swal-ecommerce-confirm,
              .swal-ecommerce-cancel {
                border-radius: 8px !important;
                padding: 0.75rem 2rem !important;
                font-weight: 500 !important;
                font-size: 0.95rem !important;
                transition: all 0.2s ease !important;
                border: none !important;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
              }
              
              .swal-ecommerce-confirm:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
              }
              
              .swal-ecommerce-cancel:hover {
                background-color: #4b5563 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
              }
              
              .swal2-icon {
                border-width: 3px !important;
              }
            `;
            document.head.appendChild(style);
          }
        },
      }).then((result) => {
        if (result.isConfirmed && action) {
          action();
        } else if (result.isDismissed && cancelAction) {
          cancelAction();
        }
        dispatch(clearAlert());
      });
    }
  }, [alert, dispatch]);

  return null;
}