defmodule Helper do
  def pad(num) do
    num
    |> to_str
    |> String.rjust(6)
  end

  def to_str(num) do
    try do
      Integer.to_string num
    rescue _e in ArgumentError ->
        num
        |> Float.to_char_list([decimals: 3, compact: true])
        |> Kernel.to_string
    end
  end
end


[size|_] = System.argv
{size, _} = Integer.parse size
IO.puts """
For a line height of #{size}px :

rows        #{Helper.pad(1)} #{Helper.pad(2)} #{Helper.pad(3)} #{Helper.pad(4)} #{Helper.pad(5)}
height      #{Helper.pad(1 * size)} #{Helper.pad(2 * size)} #{Helper.pad(3 * size)} #{Helper.pad(4 * size)} #{Helper.pad(5 * size)}

rows        #{Helper.pad(0.5)} #{Helper.pad(1.5)} #{Helper.pad(2.5)} #{Helper.pad(3.5)} #{Helper.pad(4.5)} #{Helper.pad(5.5)}
height      #{Helper.pad(0.5 * size)} #{Helper.pad(1.5 * size)} #{Helper.pad(2.5 * size)} #{Helper.pad(3.5 * size)} #{Helper.pad(4.5 * size)} #{Helper.pad(5.5 * size)}
"""
System.halt(0)

