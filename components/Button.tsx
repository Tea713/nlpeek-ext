interface ButtonProps {
  children: string;
  active: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-slate-800 text-white hover:bg-slate-700"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
